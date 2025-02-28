import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CameraService {
    private _videoElement: HTMLVideoElement | null = null;
    private _stream: MediaStream | null = null;

    constructor() {}

    async connect(videoElement: HTMLVideoElement): Promise<void> {
        this._videoElement = videoElement;
        try {
            this._stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this._videoElement.srcObject = this._stream;
            await this._videoElement.play();
        } catch (error) {
            console.error('Error accessing the camera', error);
        }
    }

    isConnected(): boolean {
        return !!this._stream;
    }

    pause(): void {
        if (this._videoElement) {
            this._videoElement.pause();
        }
    }

    play(): void {
        if (this._videoElement) {
            this._videoElement.play();
        }
    }

    snapshot(canvas:HTMLCanvasElement, callbackFn:Function){
        if (!this._videoElement) {
            return callbackFn(null, new Error('No video element'));
        }
        //const canvas = document.createElement('canvas');
        canvas.width = this._videoElement.videoWidth;
        canvas.height = this._videoElement.videoHeight;
        canvas.classList.remove('fade-in');
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(this._videoElement, 0, 0, canvas.width, canvas.height);
            canvas.classList.add('fade-in');
            return callbackFn(canvas.toDataURL('image/png'));
        }
        return callbackFn(null, new Error('Unable to get canvas context'));
    }

    disconnect(): void {
        if (this._stream) {
            this._stream.getTracks().forEach(track => track.stop());
            this._stream = null;
        }
        if (this._videoElement) {
            this._videoElement.srcObject = null;
        }
    }
}