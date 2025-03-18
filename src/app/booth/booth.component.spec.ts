import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothComponent } from './booth.component';

describe('BoothComponent', () => {
  let component: BoothComponent;
  let fixture: ComponentFixture<BoothComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoothComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests...

  // should contain a video element
  it('should contain a video element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('video')).toBeTruthy();
  });
    // Test if the component initializes with the correct default values
    it('should initialize with default values', () => {
        expect(component.timer.value).toBe(3);
        expect(component.timer.active).toBeFalse();
        expect(component.images.length).toBe(0);
        expect(component.shutterCount).toBe(0);
        expect(component.curFilter).toBe('grayscale');
        expect(component.isConnected).toBeFalse();
    });

    // Test if the connect method sets isConnected to true
    it('should set isConnected to true when connect is called', async () => {
        const cameraServiceSpy = spyOn(component['_cameraService'], 'connect').and.returnValue(Promise.resolve());
        const isConnectedSpy = spyOn(component['_cameraService'], 'isConnected').and.returnValue(true);

        await component.connect();
        expect(cameraServiceSpy).toHaveBeenCalled();
        expect(isConnectedSpy).toHaveBeenCalled();
        expect(component.isConnected).toBeTrue();
    });

    // Test if the resetTimer method resets the timer correctly
    it('should reset the timer when resetTimer is called', () => {
        component.timer = { id: setInterval(() => {}, 1000), value: 1, active: true };
        component.resetTimer();
        expect(component.timer.active).toBeFalse();
        expect(component.timer.value).toBe(3);
        expect(component.timer.id).toBeNull();
    });

    // Test if the resetState method resets the state correctly
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

    // TODO: fix if possible issue is likely with the cameraService.snapshot method
    // Test if the takeSnapshot method updates images array
    // it('should update images array when takeSnapshot is called', () => {
    //     const snapshotSpy = spyOn(component['_cameraService'], 'snapshot').and.callFake((canvas, callback) => {
    //         callback('imageData', null);
    //     });

    //     component.takeSnapshot();
    //     expect(snapshotSpy).toHaveBeenCalled();
    //     expect(component.images[component.curCanvas]).toBe('imageData');
    // });

    // Test if the changeFilter method applies the correct filter
    it('should apply the correct filter when changeFilter is called', () => {
        const event = { target: { id: 'filter2' } };
        component.changeFilter(event);

        expect(component.curFilter).toBe('sepia');
        component.canvases.forEach((canvas) => {
            expect(canvas.nativeElement.classList.contains('sepia')).toBeTrue();
        });
    });

    // Test if the showPrint method calls the print service
    it('should call the print service when showPrint is called', () => {
        const printSpy = spyOn(component['_printService'], 'generatePhotoStrip');
        component.showPrint();
        expect(printSpy).toHaveBeenCalledWith(component.photostrip.nativeElement, component['_printService'].print);
    });

    // Test if the showDownload method calls the download service
    it('should call the download service when showDownload is called', () => {
        const downloadSpy = spyOn(component['_printService'], 'generatePhotoStrip');
        component.showDownload();
        expect(downloadSpy).toHaveBeenCalledWith(component.photostrip.nativeElement, component['_printService'].download);
    });
});
