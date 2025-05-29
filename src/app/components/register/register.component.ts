import { Component, inject } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/Services/auth.service';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { NgClass } from '@angular/common';
import { RxReactiveFormsModule, RxwebValidators } from '@rxweb/reactive-form-validators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, ButtonModule,NgClass,RxReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {

    private readonly _AuthService = inject(AuthService)
    private readonly _FormBuilder = inject(FormBuilder)
    private readonly _Router = inject(Router)
    msgError:string = "" 
    isLoading:boolean = false
    constructor(private messageService: MessageService) {}

    RegisterForm:FormGroup = this._FormBuilder.group({
        name: [null, [Validators.required,Validators.minLength(3),Validators.maxLength(20)]  ],
        email: [null,[Validators.required,Validators.email]],
        password: [null,[Validators.required,Validators.pattern(/^\w{6,}$/)]],
        rePassword: [null,[RxwebValidators.compare({fieldName:'password' })]],
        phone:[null,[Validators.required,Validators.pattern(/^01[0125][0-9]{8}$/)]]
    }, {
        //custom validation here

    })

    registerSubmit():void{
        if(this.RegisterForm.valid){
            this.isLoading = true
            this._AuthService.setRegisterForm(this.RegisterForm.value).subscribe({
                next : (res)=>{
                    this.messageService.add({ severity: 'success', summary: 'Registerd successful', detail: 'Your account has been registerd', life: 3000 });
                    if(res.message == "success"){
                        setTimeout(() => {
                            this._Router.navigate(['/login'])
                        }, 3000);
                    }
                    this.RegisterForm.reset();
                    this.isLoading = false
                },
                error:(err:HttpErrorResponse)=>{
                    this.messageService.add({ severity: 'error', summary: 'Registration Error', detail: err.error.message, life: 3000 });
                    this.msgError = err.error.message;
                    this.RegisterForm.reset();
                    this.isLoading = false
                },
                complete:()=>{
                    this.msgError = "";
                }
            })
        } 
        else{
            this.RegisterForm.setErrors({misMatch:true})
            this.RegisterForm.markAllAsTouched()
        }     
    }
}
