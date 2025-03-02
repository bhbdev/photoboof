
import { Component } from '@angular/core';
import { BoothComponent } from "./booth/booth.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { featherGithub } from '@ng-icons/feather-icons';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [BoothComponent, NgIcon],
    providers: [provideIcons({featherGithub})]
  })
  
export class AppComponent {
    title = 'photoboof';
}

