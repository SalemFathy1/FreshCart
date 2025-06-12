import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../core/Services/orders.service';

@Component({
  selector: 'app-order',
  imports: [ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _OrdersService = inject(OrdersService)
  cartId:string | null = ''
  msgError : string = ''
  isLoading:boolean = false
   egyptianGovernorates: string[] = [
    "Cairo",
    "Alexandria",
    "Giza",
    "Dakahlia",
    "Beheira",
    "Qalyubia",
    "Monufia",
    "Gharbia",
    "Sharqia",
    "Port Said",
    "Suez",
    "Ismailia",
    "Kafr El Sheikh",
    "Damietta",
    "Luxor",
    "Aswan",
    "Sohag",
    "Minya",
    "Beni Suef",
    "Faiyum",
    "Asyut",
    "Red Sea",
    "New Valley",
    "Matrouh",
    "Qena",
    "North Sinai",
    "South Sinai"
  ];
  AddressForm :  FormGroup = new FormGroup({
    detials: new FormControl(null,[Validators.required, Validators.pattern('^[a-zA-Z0-9 ,.-]+$')]),
    phone: new FormControl(null,[Validators.required, Validators.pattern('^01[0125][0-9]{8}$')]),
    city: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
  })
  

  ngOnInit(): void {
   this._ActivatedRoute.paramMap.subscribe({
    next:(param)=>{
      let cartId = param.get('cartid');
      this.cartId = cartId

    },error:(err)=>{
      console.log(err);
    }
   })
  }


  addressSubmit():void{

    this.isLoading= true;
    console.log(this.cartId);
    console.log(this.AddressForm.value);


    this._OrdersService.CheckOut(this.cartId!,this.AddressForm.value).subscribe({
      next: (res) => {
      this.isLoading= true;
        console.log(res);
        window.open(res.session.url, '_self');
      },
      error: (err) => {
        this.msgError = err.error.message;
        console.log(err);
      }
      
  })
  
  }

  }
