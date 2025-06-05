import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputOtpModule } from 'primeng/inputotp';
import { AuthService } from '../../core/Services/Authentication/auth.service';
import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-forgetpassword',
  imports: [ReactiveFormsModule,InputOtpModule,FormsModule],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ForgetpasswordComponent {
  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)
  isLoading:boolean = false
  step:number = 1
  value:number = 4
  codeSent:boolean = false
  msgError!: string
  email!:string 
  constructor(private messageService:MessageService){}
  emailCheckForm:FormGroup = new FormGroup({
    email: new FormControl(null,[Validators.required,Validators.email])
  })


  codeCheckForm:FormGroup = new FormGroup({
    resetCode: new FormControl(null,[Validators.required,Validators.pattern(/^[0-9]{6}$/)])
  })

  
  resetCheckForm:FormGroup = new FormGroup({
    email: new FormControl(null,[Validators.required,Validators.email]),
    newPassword: new FormControl(null,[Validators.required,Validators.pattern(/^\w{6,}$/)]),

  })



  verifyEmail(email?:string):void{
    this.email = this.emailCheckForm.get('email')?.value
    this.resetCheckForm.get('email')?.patchValue(this.email)
    this.isLoading = true
    this._AuthService.setEmailVerify(this.emailCheckForm.value).subscribe({
      next:(res:any)=>{
        // console.log(res);
        this.isLoading = false
        this.step = 2
        this.emailCheckForm.reset()

        
      },
      error:(err:HttpErrorResponse)=>{
        this.isLoading = false
        console.log(err);
        this.msgError = err.error.message
      }
    })
    
    
  }

  verifyCode():void{
    this.isLoading = true
    this._AuthService.setCodeVerify(this.codeCheckForm.value).subscribe({
      next:(res)=>{
        console.log(res);
        this.isLoading = false
        this.codeCheckForm.reset()
        if (res.status === "Success") {
          this.step = 3
        }
      },
      error:(err)=>{
        console.log(err);
        this.isLoading = false
        this.codeCheckForm.reset()
        this.msgError = err.error.message
      }
    })
  }

  resetPass():void{
    this.isLoading = true
    this._AuthService.setResetPassword(this.resetCheckForm.value).subscribe({
      next:(res)=>{
        console.log(res);
        this.isLoading = false
        this.messageService.add({ severity: 'success', summary: 'Password Changes', detail: 'Password reset successful', life: 3000 });

        setTimeout(() => {
          this._Router.navigate(['/login'])
        }, 1000);
      },
      error:(err)=>{
        console.log(err);
        
      }
    })    
  }

}
