import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/Services/auth.service';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, ButtonModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {

    private readonly _AuthService = inject(AuthService)
    msgError:string = "" 
    isLoading:boolean = false
    constructor(private messageService: MessageService) {}
    RegisterForm:FormGroup = new FormGroup({
        name: new FormControl(null, [Validators.required,Validators.minLength(3),Validators.maxLength(20)]  ),
        email: new FormControl(null,[Validators.required,Validators.email]),
        password: new FormControl(null,[Validators.required,Validators.pattern(/^\w{6,}$/)]),
        rePassword: new FormControl(null),
        phone:new FormControl(null,[Validators.required,Validators.pattern(/^01[0125][0-9]{8}$/)])
    } ,
    this.confirmPassword);

    confirmPassword(g:AbstractControl){
        if(g.get('password')?.value === g.get('rePassword')?.value){
            return null
        }else{
            return {
                misMatch : true
            }
        }
    }    

    registerSubmit():void{
        if(this.RegisterForm.valid){
            this.isLoading = true
            this._AuthService.setRegisterForm(this.RegisterForm.value).subscribe({
                next : (res)=>{
                    console.log(res);
                    this.messageService.add({ severity: 'success', summary: 'Registerd successful', detail: 'Your account has been registerd', life: 2000 });
                    this.RegisterForm.reset();
                    this.isLoading = false
                },
                error:(err:HttpErrorResponse)=>{
                    console.log(err);
                    this.msgError = err.error.message;
                    this.RegisterForm.reset();
                    this.isLoading = false
                },
                complete:()=>{
                    this.msgError = "";
                }
            })
        }        
    }
}
