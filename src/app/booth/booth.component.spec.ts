import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothComponent } from './booth.component';

describe('BoothComponent', () => {
    let component: BoothComponent;
    let fixture: ComponentFixture<BoothComponent>;
    let getUserMediaMock: any;
    

    beforeEach(async () => {
        const mockStream = new MediaStream();
        getUserMediaMock = jasmine.createSpy('getUserMedia').and.returnValue(Promise.resolve(mockStream))
        
        spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(getUserMediaMock);

        await TestBed.configureTestingModule({
            imports: [BoothComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BoothComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    afterEach(() => {
        // Reset the navigator.mediaDevices.getUserMedia mock
        getUserMediaMock.calls.reset();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should contain a video element', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('video')).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.timer.value).toBe(3);
        expect(component.timer.active).toBeFalse();
        expect(component.images.length).toBe(0);
        expect(component.shutterCount).toBe(0);
        expect(component.curFilter).toBe('grayscale');
        expect(component.isConnected).toBeFalse();
    });

    it('should set isConnected to true when connect is called', async () => {
        const cameraServiceSpy = spyOn(component['_cameraService'], 'connect').and.returnValue(Promise.resolve());
        const isConnectedSpy = spyOn(component['_cameraService'], 'isConnected').and.returnValue(true);

        await component.connect();
        expect(cameraServiceSpy).toHaveBeenCalled();
        expect(isConnectedSpy).toHaveBeenCalled();
        expect(component.isConnected).toBeTrue();
    });

    it('should reset the timer when resetTimer is called', () => {
        component.timer = { id: setInterval(() => {}, 1000), value: 1, active: true };
        component.resetTimer();
        expect(component.timer.active).toBeFalse();
        expect(component.timer.value).toBe(3);
        expect(component.timer.id).toBeNull();
    });

    it('should reset the state when resetState is called', () => {
        component.images = ['image1', 'image2'];
        component.shutterCount = 2;
        component.timer = { id: setInterval(() => {}, 1000), value: 1, active: true };

        component.resetState();
        expect(component.images.length).toBe(0);
        expect(component.shutterCount).toBe(0);
        expect(component.timer.active).toBeFalse();
        expect(component.timer.value).toBe(3);
        expect(component.timer.id).toBeNull();
    });

    it('should update images array when takeSnapshot is called', () => {
      const snapshotSpy = spyOn(component['_cameraService'], 'snapshot').and.callFake((canvas, callback) => {
        callback('imageData', null);
      });

      component.takeSnapshot();
      expect(snapshotSpy).toHaveBeenCalled();
      expect(component.images[0]).toBe('imageData');
    });

    it('should apply the correct filter when changeFilter is called', () => {
        const event = { target: { id: 'filter2' } };
        component.changeFilter(event);

        expect(component.curFilter).toBe('sepia');
        component.canvases.forEach((canvas) => {
            expect(canvas.nativeElement.classList.contains('sepia')).toBeTrue();
        });
    });

    it('should call the print service when showPrint is called', () => {
        const printSpy = spyOn(component['_printService'], 'generatePhotoStrip');
        component.showPrint();
        expect(printSpy).toHaveBeenCalledWith(component.photostrip.nativeElement, component['_printService'].print);
    });

    it('should call the download service when showDownload is called', () => {
        const downloadSpy = spyOn(component['_printService'], 'generatePhotoStrip');
        component.showDownload();
        expect(downloadSpy).toHaveBeenCalledWith(component.photostrip.nativeElement, component['_printService'].download);
    });
});
