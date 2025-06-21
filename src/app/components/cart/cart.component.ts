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
                this.isLoading = false
                this.cartDetails = res.data 
            },
            error:(err)=>{
                this.isLoading = false
                console.error(err);
            }
        })
      }

      removeItemFromCart(id:string):void{
        this._CartService.removeSpecificCartProduct(id).subscribe({
            next:(res)=>{
                this.messageService.add({ severity: 'error', summary: 'Item Removed ', detail: 'Item Removed from cart successful', life: 2000 });
                this.cartDetails = res.data 
                this.cartCount = res.numOfCartItems
                this._CartService.cartCount.next(res.numOfCartItems)
            },
            error:(err)=>{
                console.error(err);
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
                this.cartDetails = res.data 
            },
            error:(err)=>{
                console.error(err);
                this.isLoading = false

            }
        })
      }

      navigateToCheckout() {
        if (this.cartDetails?._id , this.cartCount > 0) {
          this._Router.navigate(['/order', this.cartDetails._id]);
        } else {
          console.error('Cart ID is not available Or cart is empty');
          this.messageService.add({ severity: 'error', summary: 'Checkout Error', detail: 'Cart is empty or not available', life: 3000 });
          
        }
      }


      clearCart():void{
          this.cartCount = 0
        this.isLoading = true
        this._CartService.clearCartItems().subscribe({
            next:(res)=>{
                this.isLoading = false
                this.getCartProducts()
                this.messageService.add({ severity: 'error', summary: 'Clearing Cart ', detail: 'cart cleared successful', life: 2000 });
                this._CartService.cartCount.next(0)
            },
            error:(err)=>{
                console.error(err);
                this.isLoading = false
            }
        })
      }

      ngOnDestroy(): void {
          this.cartItemsubscription.unsubscribe()
      }
}
