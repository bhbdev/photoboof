import { TestBed } from '@angular/core/testing';
import { CameraService } from './camera.service';

describe('CameraService', () => {
    let service: CameraService;
    let mockVideoElement: HTMLVideoElement;
    let mockCanvasElement: HTMLCanvasElement;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CameraService);

        mockVideoElement = document.createElement('video');
        mockCanvasElement = document.createElement('canvas');
    });

    afterEach(() => {
        service.disconnect();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should connect to the camera and set video element source', (done) => {
        spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve(new MediaStream()));

        service.connect(mockVideoElement).then(() => {
            expect(mockVideoElement.srcObject).toBeTruthy();
            expect(service.isConnected()).toBeTrue();
            done();
        });
    });
    it('should handle errors when connecting to the camera', (done) => {
        spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.reject('Camera error'));
        spyOn(console, 'error');

        service.connect(mockVideoElement).then(() => {
            expect(console.error).toHaveBeenCalledWith('Error accessing the camera', 'Camera error');
            expect(service.isConnected()).toBeFalse();
            done();
        });
    });

    it('should pause the video element', async () => {
        await service.connect(mockVideoElement);
        spyOn(mockVideoElement, 'pause');

        service.pause();

        expect(mockVideoElement.pause).toHaveBeenCalled();
    });

    it('should play the video element', async () => {
        await service.connect(mockVideoElement);
        spyOn(mockVideoElement, 'play');

        service.play();

        expect(mockVideoElement.play).toHaveBeenCalled();
    });
    

    it('should take a snapshot and return a data URL', async () => {
        await service.connect(mockVideoElement);
        spyOn(mockCanvasElement, 'getContext').and.returnValue({
            drawImage: jasmine.createSpy('drawImage'),
        } as unknown as CanvasRenderingContext2D);

        const callbackFn = jasmine.createSpy('callbackFn');
        service.snapshot(mockCanvasElement, callbackFn);

        expect(mockCanvasElement.getContext).toHaveBeenCalledWith('2d');
        expect(callbackFn).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('should handle errors when taking a snapshot without a video element', () => {
        const callbackFn = jasmine.createSpy('callbackFn');
        service.snapshot(mockCanvasElement, callbackFn);

        expect(callbackFn).toHaveBeenCalledWith(null, jasmine.any(Error));
    });

    it('should disconnect the camera and stop all tracks', async () => {
        const mockStream = new MediaStream();
        spyOn(mockStream, 'getTracks').and.returnValue([{ stop: jasmine.createSpy('stop') }] as unknown as MediaStreamTrack[]);
        spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve(mockStream));

        await service.connect(mockVideoElement);
        service.disconnect();

        expect(mockStream.getTracks()[0].stop).toHaveBeenCalled();
        expect(mockVideoElement.srcObject).toBeNull();
        expect(service.isConnected()).toBeFalse();
    });
});