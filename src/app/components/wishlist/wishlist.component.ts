import { CurrencyPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { WishlistService } from '../../core/Services/wishlist.service';
import { CartService } from '../../core/Services/cart.service';
import { MessageService } from 'primeng/api';
import { SkeletonModule} from 'primeng/skeleton';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule,CurrencyPipe,BadgeModule, OverlayBadgeModule,SkeletonModule,RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {
  wishListItems: any[] = [];
  isLoading: boolean = false;
  loadingStates: { [id: string]: boolean } = {};
  constructor(private messageService : MessageService) { }
  private readonly _WishlistService = inject(WishlistService)
  private readonly _CartService = inject(CartService)

ngOnInit(): void {
  this.getWishlistItems(true);
}

getWishlistItems(load : boolean):void{
  this.isLoading = load;
  this._WishlistService.getWishlist().subscribe({
    next:(res)=>{
      this.isLoading = false;
      this.wishListItems = res.data;
    },error:(err)=>{
      console.error(err);
      
    }
  })
}

addProductToCart(poductId:string):void{
  this._CartService.addProductToCart(poductId).subscribe({
      next:(res)=>{
          this.messageService.add({ severity: 'success', summary: 'Add to Cart', detail: 'Item added to cart successful', life: 3000 });
          this._CartService.cartCount.next(res.numOfCartItems)
      },
      error:(err)=>{
          console.error(err);
      }
  })
}

removeFromWishlist(productId: string): void {
  this.loadingStates[productId] = true;
  this._WishlistService.removeFromWishlist(productId).subscribe({
    next: (res) => {
      delete this.loadingStates[productId];
      this.getWishlistItems(false); // Refresh the wishlist after removal
      this.messageService.add({ severity: 'success', summary: 'Removed from Wishlist', detail: 'Item removed successfully', life: 3000 });
      this._WishlistService.wishcounter.next(res.data.length)
    },
    error: (err) => {
      console.error(err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove item from wishlist', life: 3000 });
    }
  });
}
}
