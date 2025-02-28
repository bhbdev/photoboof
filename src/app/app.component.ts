
import { Component } from '@angular/core';
import { BoothComponent } from "./booth/booth.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [BoothComponent]
  })
  
export class AppComponent {
    title = 'photoboof';
}

