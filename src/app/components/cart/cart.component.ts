import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { CartService } from '../../core/Services/cart.service';
import { ICart } from '../../core/interfaces/icart';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-cart',
    imports: [CommonModule,SkeletonModule,RouterLink],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'
})

export class CartComponent implements OnInit,OnDestroy {
    constructor(private messageService: MessageService) {}
    private readonly _CartService = inject(CartService)
    private readonly _Router = inject(Router)
    cartDetails:ICart = {} as ICart
    cartCount!:number
    cartItemsubscription!:Subscription
    isLoading:boolean = false

    ngOnInit(): void {
        this.getCartProducts()
    }

      getCartProducts():void{
        this.isLoading = true
        this.cartItemsubscription = this._CartService.getUserCartProducts().subscribe({
            next:(res)=>{
                this.cartCount = res.numOfCartItems
                console.log(this.cartCount);
                
                this.isLoading = false
                console.log(res);
                
                console.log(res.data);
                this.cartDetails = res.data 
            },
            error:(err)=>{
                this.isLoading = false
                console.log(err);
            }
        })
      }

      removeItemFromCart(id:string):void{
        this._CartService.removeSpecificCartProduct(id).subscribe({
            next:(res)=>{
                this.messageService.add({ severity: 'error', summary: 'Item Removed ', detail: 'Item Removed from cart successful', life: 2000 });
                console.log(res);
                this.cartDetails = res.data 
                this.cartCount = res.numOfCartItems
            },
            error:(err)=>{
                console.log(err);
                this.isLoading = false   
            }
        })
      }

      updateQuantity(Count : number,state:number,id:string):void{
        if(state == 1){
            Count += 1
        }else if (state == -1){
            Count -= 1
        }
        this._CartService.updateProductQuantity(id , Count).subscribe({
            next:(res)=>{
                console.log(res);
                this.cartDetails = res.data 
            },
            error:(err)=>{
                console.log(err);
                this.isLoading = false

            }
        })
      }

      navigateToCheckout() {
        if (this.cartDetails?._id) {
          this._Router.navigate(['/order', this.cartDetails._id]);
        } else {
          console.error('Cart ID is not available ');
          // You might want to show a user-friendly message here
        }
      }


      clearCart():void{
        this._CartService.clearCartItems().subscribe({
            next:(res)=>{
                console.log(res);
                this.getCartProducts()
                this.messageService.add({ severity: 'error', summary: 'Clearing Cart ', detail: 'cart cleared successful', life: 2000 });
            },
            error:(err)=>{
                console.log(err);
                this.isLoading = false
            }
        })
      }

      ngOnDestroy(): void {
          this.cartItemsubscription.unsubscribe()
      }
}
