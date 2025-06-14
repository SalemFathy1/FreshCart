import { MessageService } from 'primeng/api';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/Services/Authentication/auth.service';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink,RouterLinkActive,MenuModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
    public readonly _AuthService = inject(AuthService)
    private readonly _Router = inject(Router)
    constructor(private message:MessageService){}
    isLoading:boolean = false
    items!:any[]
    ngOnInit(): void {
        

        this.items = [
                    {
                        label: 'Account',
                        icon: 'pi pi-user',
                        command:()=>{
                            this._Router.navigate(['/account'])
                        }
                    },
                    {
                        label: 'My Orders',
                        icon: 'pi pi-shopping-cart',
                        command:()=>{
                            this._Router.navigate(['/allorders'])
                        }
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        styleClass:"logout",
                        command :  ()=> this.logout()
                    }
                ]
    }
    logout():void{
        this.isLoading = true
        setTimeout(()=>{
            this.isLoading = false
            this._AuthService.logOut()
        this.message.add({ severity: 'error', summary: 'Logged Out successful', detail: 'Come later !', life: 2000 });
        },1000)
    }

}
