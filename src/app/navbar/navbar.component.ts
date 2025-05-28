import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenuModule } from 'primeng/megamenu';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink,RouterLinkActive,MegaMenuModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    items: MegaMenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Sports',
                icon: 'pi pi-clock',
                items: [
                    [
                        {
                            label: 'Football',
                            items: [{ label: 'Kits' }, { label: 'Shoes' }, { label: 'Shorts' }, { label: 'Training' }],
                        },
                    ],
                    [
                        {
                            label: 'Running',
                            items: [{ label: 'Accessories' }, { label: 'Shoes' }, { label: 'T-Shirts' }, { label: 'Shorts' }],
                        },
                    ],
                    [
                        {
                            label: 'Swimming',
                            items: [{ label: 'Kickboard' }, { label: 'Nose Clip' }, { label: 'Swimsuits' }, { label: 'Paddles' }],
                        },
                    ],
                    [
                        {
                            label: 'Tennis',
                            items: [{ label: 'Balls' }, { label: 'Rackets' }, { label: 'Shoes' }, { label: 'Training' }],
                        },
                    ],
                ],
            },
        ];
    }
}
