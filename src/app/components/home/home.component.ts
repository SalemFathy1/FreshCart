import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-home',
    imports: [ButtonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent {

}
