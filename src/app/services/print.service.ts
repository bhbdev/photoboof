import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PrintService {

    constructor() { }

    // this.printService.print(this.photoStrip.nativeElement);
    print(images: string[]) {
        const element = document.createElement('div');
        element.id = 'photo-strip';
        images.forEach((image) => {
            const img = document.createElement('img');
            img.src = image;
            img.className = 'canvas';
            element.appendChild(img);
        });
        // open a new window with the photo strip
        // including css for printing
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Photo Strip</title>
                        <link rel="stylesheet" href="styles.css">
                    </head>
                    <body class="print">
                    </body>
                </html>
            `);
            printWindow.document.body.appendChild(element);
            printWindow.print();
        }
    }
    
}