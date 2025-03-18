import { TestBed } from '@angular/core/testing';
import { PrintService } from './print.service';

describe('PrintService', () => {
    let service: PrintService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PrintService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should generate a photo strip and call the callback function', (done) => {
        const mockElement = document.createElement('div');
        mockElement.style.width = '200px';
        mockElement.style.height = '100px';
        document.body.appendChild(mockElement);

        const callbackFn = (dataUrl: string) => {
            expect(dataUrl).toContain('data:image/png;base64');
            document.body.removeChild(mockElement);
            done();
        };

        service.generatePhotoStrip(mockElement, callbackFn);
    });

    it('should download an image with the correct filename', () => {
        const spy = spyOn(document, 'createElement').and.callThrough();
        const mockImage = 'data:image/png;base64,mockImageData';

        service.download(mockImage);

        expect(spy).toHaveBeenCalledWith('a');
        const anchor = spy.calls.mostRecent().returnValue as HTMLAnchorElement;
        expect(anchor.href).toBe(mockImage);
        expect(anchor.download).toBe('photoboof-strip.png');
    });

    it('should open a new window and print the image', () => {
        const mockImage = 'data:image/png;base64,mockImageData';
        const spy = spyOn(window, 'open').and.callFake(() => {
            return {
                document: {
                    write: jasmine.createSpy('write'),
                    close: jasmine.createSpy('close'),
                },
                print: jasmine.createSpy('print'),
            } as unknown as Window;
        });

        service.print(mockImage);

        expect(spy).toHaveBeenCalledWith('', '_blank');
        const printWindow = spy.calls.mostRecent().returnValue as any;
        expect(printWindow.document.write).toHaveBeenCalled();
        expect(printWindow.print).toHaveBeenCalled();
    });
});