import { AddressService } from './../../core/Services/address.service';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators,FormsModule  } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrdersService } from '../../core/Services/orders.service';
import { CartService } from '../../core/Services/cart.service';
import { ICart } from '../../core/interfaces/icart';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { AccordionModule } from 'primeng/accordion';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';



@Component({
  selector: 'app-order',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,RouterLink,SkeletonModule,AccordionModule,RadioButtonModule,DialogModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class OrderComponent implements OnInit {
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _OrdersService = inject(OrdersService)
  private readonly _CartService = inject(CartService)
  private readonly _AddressService = inject(AddressService)
  private readonly _Router = inject(Router)

  cartId:string | null = ''
  msgError !: string 
  isLoading:boolean = false
  cartDetails:ICart = {} as ICart
  cartItems !: any[]
  AddressArr : any[] = []
  cartItemsubscription!:Subscription
  visible: boolean = false;
  paymentMethod = new FormControl(null);
  selectedAddressId = new FormControl(null);



  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
     next:(param)=>{
       let cartId = param.get('cartid');
       this.cartId = cartId
       if(cartId){
         this.getCartProducts()
        }
      },error:(err)=>{
       console.error(err);
     }
    })
    this.getAddress()
   }

  showDialog(): void {
      this.visible = true;
  }

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
    details: new FormControl(null , [Validators.required , Validators.minLength(10)]),
    phone: new FormControl(null   , [Validators.required , Validators.pattern(/^(010|011|012|015)[0-9]{8}$/)]),
    city: new FormControl(null  , [Validators.required]),
  })

  getCartProducts():void{
    this.isLoading = true
    this.cartItemsubscription = this._CartService.getUserCartProducts().subscribe({
        next:(res)=>{
            this.isLoading = false
            this.cartDetails = res.data 
        },
        error:(err)=>{
            this.isLoading = false
            console.error(err);
        }
    })
  }

  getAddress():void{
    this.isLoading = true;
    this._AddressService.getAddresses().subscribe({
      next:(res)=>{
        this.isLoading = false;
        this.AddressArr = res.data
      },error:(err)=>{
        console.error(err);
      }
    })
  }

  addressSubmit():void{

    if (this.cartItems) {
      this.isLoading = false;
      this.msgError = 'Your cart is empty';
      return;
    }
    //check if the address
    if (!this.selectedAddressId.value) {
      this.isLoading = false;
      this.msgError = 'Please select an address';
      return;
    }
    // check if the payment method is selected
    if (this.paymentMethod.value === null) {
      this.isLoading = false;
      this.msgError = 'Please select a payment method';
      return;
    }
      
    const selectedAddress = this.AddressArr.find(addr => addr._id === this.selectedAddressId.value);
    // Check if address was found
    if (!selectedAddress) {
      this.isLoading = false;
      this.msgError = 'Selected address not found';
      return;
    }

    const shippingAddress = {
      details: selectedAddress.details,
        phone: selectedAddress.phone,
        city: selectedAddress.city
    };

    this.isLoading= true;

    if(this.paymentMethod.value != null){
        if(this.paymentMethod.value == 'cash'){
          this._OrdersService.CashPay(this.cartId!,shippingAddress).subscribe({
            next: (res) => {
              this._CartService.cartCount.next(0)
              this._Router.navigate(['/allorders']);
            },error:(err)=>{
              this.msgError = err.error.message;
              console.error(err);
            }
          })
        }
        else if(this.paymentMethod.value == 'card'){
          this._OrdersService.CheckOut(this.cartId!,shippingAddress).subscribe({
            next: (res) => {
              this._CartService.cartCount.next(0)
              window.open(res.session.url, '_self');
            },
            error: (err) => {
              this.msgError = err.error.message;
              console.error(err);
            }
         })
        }
    }
  }

  addAddress():void{
    if(this.AddressForm.invalid) {
      this.msgError = 'Please fill in all required fields correctly.';
      return;
    }
    this.isLoading = true
    this.visible = false;
    this._AddressService.addAddress(this.AddressForm.value).subscribe({
      next:(res)=>{
      this.isLoading = false
        this.getAddress();
      this.AddressForm.reset();
      },error:(err)=>{
        console.error(err);
      }
  })
}

removeAddress(id:string){
  this._AddressService.deleteAddress(id).subscribe({
    next:(res)=>{
      this.getAddress();
    },error:(err)=>{
      console.error(err);
    }
  })
}

}
