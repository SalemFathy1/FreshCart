import { MessageService } from 'primeng/api';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/Services/auth.service';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink,RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    public readonly _AuthService = inject(AuthService)
    constructor(private message:MessageService){}
    isLoading:boolean = false
    logout():void{
        this.isLoading = true
        setTimeout(()=>{
            this.isLoading = false
            this._AuthService.logOut()
        this.message.add({ severity: 'error', summary: 'Logged Out successful', detail: 'Come later !', life: 2000 });
        },1000)
    }

}
