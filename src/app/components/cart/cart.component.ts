import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { CartService } from '../../core/Services/cart.service';

@Component({
    selector: 'app-cart',
    imports: [CommonModule,SkeletonModule,RouterLink],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
    private readonly _CartService = inject(CartService)
    cartItems!:any 

    ngOnInit(): void {
        this.getCartProducts()
    }



      getCartProducts():void{
        this._CartService.getUserCartProducts().subscribe({
            next:(res)=>{
                console.log(res.data.products);
                this.cartItems = res.data.products
                
            },
            error:(err)=>{
                console.log(err);
                
            }
        })
      }

}
