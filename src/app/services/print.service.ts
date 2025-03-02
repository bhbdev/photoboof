import { Injectable } from '@angular/core';
import 'html2canvas';
import html2canvas from 'html2canvas';

@Injectable({
    providedIn: 'root'
})
export class PrintService {

    constructor() { }

    generatePhotoStrip(elem:HTMLDivElement, callbackFn:Function): void {
    
        const psCanvas = document.createElement('canvas');
        psCanvas.width = elem.clientWidth + 20;
        psCanvas.height = elem.clientHeight; 
        const ctx = psCanvas.getContext('2d');
        if (!ctx) {
            return;
        }
        html2canvas(elem).then((canvas) => {
            ctx.drawImage(canvas, 0, 0, psCanvas.width, psCanvas.height);
            callbackFn(psCanvas.toDataURL('image/png'));
        });

    }

    download(image: string): void {
        const a = document.createElement('a');
        a.href = image;
        a.download = 'photoboof-strip.png';
        a.click();
    }

    print(image: string): void {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <style>
                            body { margin: 0; }
                        </style>
                    </head>
                    <body onload="window.print()" onafterprint="window.close()">
                        <img src="${image}" alt="" />
                    </body>
                </html>
            `);
            printWindow.print();
        }
    }

    // this.printService.print(this.photoStrip.nativeElement);
    // print(images: string[]) {
    //     const element = document.createElement('div');
    //     element.id = 'photo-strip';
    //     images.forEach((image) => {
    //         const img = document.createElement('img');
    //         img.src = image;
    //         img.className = 'canvas';
    //         element.appendChild(img);
    //     });
    //     // open a new window with the photo strip
    //     // including css for printing
    //     const printWindow = window.open('', '_blank');
    //     if (printWindow) {
    //         printWindow.document.write(`
    //             <html>
    //                 <head>
    //                     <title>Photo Strip</title>
    //                     <link rel="stylesheet" href="styles.css">
    //                 </head>
    //                 <body class="print">
    //                 </body>
    //             </html>
    //         `);
    //         printWindow.document.body.appendChild(element);
    //         printWindow.print();
    //     }
    // }
    
}