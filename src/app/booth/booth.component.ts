import { Component, ViewChild, ElementRef, OnInit,QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { CameraService } from '../services/camera.service';
import { PrintService } from '../services/print.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { faCamera, faPlay, faPause, faClose, faV } from '@fortawesome/free-solid-svg-icons';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
    featherCamera, 
    featherPlay,
    featherPause,
    featherCameraOff,
} from '@ng-icons/feather-icons';

// define conts for the timer seconds and the number of images to take
const TIMER_SECONDS = 3;
const MAX_IMAGES = 3;

@Component({
  selector: 'app-booth',
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({featherCamera,featherPlay,featherPause,featherCameraOff})],
  templateUrl: './booth.component.html',
  styleUrl: './booth.component.scss'
})
export class BoothComponent implements AfterViewInit {
 
    constructor(
        private _cameraService: CameraService,
        private _printService: PrintService
    ) {}

    @ViewChild('video') video!: ElementRef;
    @ViewChild('photostrip') photostrip!: ElementRef;
    @ViewChildren('canvas', { read: ElementRef }) canvases!: QueryList<ElementRef>;
    

    filters: string[] = ['grayscale', 'sepia', 'blur', 'brightness', 'contrast', 'hue-rotate',
                        'hue-rotate2', 'hue-rotate3', 'saturate', 'invert', 'clear'];

    timer: { id: any, value: number, active: boolean } = {
        id: null,
        value: TIMER_SECONDS,
        active: false
    }
    canvas: HTMLCanvasElement[] = [];
    images: string[] = [];
    shutterCount = 0;
    curCanvas: number = 0;
    curFilter: string = 'grayscale';
    isConnected: boolean = false;

    ngAfterViewInit() {
        this.canvas = this.canvases.toArray().map(c => c.nativeElement);
    }

    updateCanvasSize() {
        const canvasElement = this.canvas[this.curCanvas];
        canvasElement.width = this.video.nativeElement.clientWidth;
        canvasElement.height = this.video.nativeElement.clientHeight;
    }

    startTimer(override: boolean = false) {
        if (this.timer.active && !override) {
            return;
        }
        if (this.timer.id) {
            clearInterval(this.timer.id);
        }
        this.timer.active = true;

        this.timer.id = setInterval(() => {
            if (this.timer.value > 0) {
                if (!this.timer.active) {
                    return clearInterval(this.timer.id);
                }
                this.timer.value--;
            } else {
                this.takeSnapshot();
                if (this.shutterCount < MAX_IMAGES - 1) {
                    this.timer.value = TIMER_SECONDS;
                    this.shutterCount++;
                    this.startTimer(true);
                } else {
                    this.resetTimer();
                }
            }   
        }, 1000); 
    }

    resetTimer(): any {
        if (this.timer.id) {
            clearInterval(this.timer.id);
        }
        this.timer = {
          active: false,
          value: TIMER_SECONDS,
          id: null
        }
        this.shutterCount = 0;

    }
    resetState(): any {
        this.resetTimer();
        if (this.timer.id) {
          clearInterval(this.timer.id);
          this.timer.id = null;
        }
        this.images.length = 0;
        this.shutterCount = 0;
    }
    connect() {
        this._cameraService.connect(this.video.nativeElement).then(() => { 
            this.isConnected = this._cameraService.isConnected();
            this.updateCanvasSize();
        });
    }

    playStream() {
        this._cameraService.play();
    }

    pauseStream() {
        this._cameraService.pause();
    }

    stopStream() {
        this._cameraService.disconnect();
        this.isConnected = this._cameraService.isConnected();
    }

    takeSnapshot() {
        this._cameraService.snapshot(this.canvas[this.curCanvas], (img:string,err:Error) => {
            if (err) {
                console.log(err);
                this.resetState();
                return;
            }
            this.images[this.curCanvas] = img;
            this.canvas[this.curCanvas].classList.remove('fade-in');
            this.curCanvas = (this.curCanvas + 1) % 3;
            
        });
    }

    changeFilter(event: any) {
        const el = event.target;
        const idx = el.id.replace(/filter/, '');
        const effect = this.filters[idx - 1];

        if (effect == 'clear') {
            this.filters.forEach(filter => {
                this.canvases.forEach(c => c.nativeElement.classList.remove(filter));
            });
        } else {
            if (this.curFilter && this.curFilter != effect) {
                this.canvases.forEach(c => c.nativeElement.classList.remove(this.curFilter));
            }
            this.curFilter = effect;
            this.canvases.forEach(c => c.nativeElement.classList.add(effect));
        }
    }

    showPrint() {
        // show a print preview
       // this._printService.print(this.images);
       this._printService.generatePhotoStrip(this.photostrip.nativeElement,this._printService.print);
    }
    showDownload() {
        // download the photo strip
        this._printService.generatePhotoStrip(this.photostrip.nativeElement,this._printService.download);
    }

}
