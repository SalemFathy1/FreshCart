import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/Services/Authentication/auth.service';
import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule,RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private readonly _AuthService = inject(AuthService)
    private readonly _Router = inject(Router)

    constructor(private messageService: MessageService) {}
    msgError:string = ""
    isLoading : boolean = false
LoginForm:FormGroup = new FormGroup({
    email:new FormControl(null,[Validators.required,Validators.email]),
    password: new FormControl(null,[Validators.required,Validators.pattern(/^\w{6,}$/)]),
})

loginSubmit():void{
    if(this.LoginForm.valid){
        this.isLoading = true
        this._AuthService.setLoginrForm(this.LoginForm.value).subscribe({
            next:(res)=>{
                this.messageService.add({ severity: 'success', summary: 'Logged In successful', detail: 'Logged In successful', life: 3000 });
                
                //save token
                localStorage.setItem('userToken',res.token)
                
                //decode the token
                this._AuthService.decodeToken()
                
                //navigate to the home
                if(res.message == "success"){
                    setTimeout(() => {
                        this._Router.navigate(['/home'])
                    }, 1000);
                }
                this.isLoading = false
                this.LoginForm.reset()
            },
            error:(err:HttpErrorResponse)=>{
                this.msgError = err.error.message
                this.isLoading = false
            },
            complete:()=>{
                this.msgError = "";
            }
        })
    }
}
}
