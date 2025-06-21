import { SwiperContainer } from 'swiper/element';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/Services/product.service';
import { CommonModule} from '@angular/common';
import { Subscription } from 'rxjs';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { IProduct } from '../../core/interfaces/iproduct';
import { WishlistService } from '../../core/Services/wishlist.service';
import { MessageService } from 'primeng/api';
import { CartService } from '../../core/Services/cart.service';



@Component({
    selector: 'app-product',
    imports: [CommonModule,RouterLink,Rating,FormsModule,SkeletonModule],
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss',
    schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class ProductComponent implements OnInit ,OnDestroy {
    @ViewChild ('swiper') CatSwiper!:SwiperContainer

    private readonly _ActivatedRoute = inject(ActivatedRoute)
    private readonly _ProductService = inject(ProductService)
    private readonly _WishlistService = inject(WishlistService)
    private readonly _messageService = inject(MessageService)
    private readonly _CartService = inject(CartService)
    getProductDetails!:Subscription
    productData: IProduct = {
        sold: 0,
        images: [],
        subcategory: [],
        ratingsQuantity: 0,
        _id: '',
        title: '',
        slug: '',
        description: '',
        quantity: 0,
        price: 0,
        imageCover: '',
        priceAfterDiscount: 0,
        category: {
          _id: '',
          name: '',
          slug: '',
          image: ''
        },
        brand: {
          _id: '',
          name: '',
          slug: '',
          image: ''
        },
        ratingsAverage: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
        reviews: [],
        id: ''
      };
    productImages!:string[]
    buyQuantity:number = 1
    isLoading:boolean = false


    ngOnInit(): void {
        this.isLoading = true
        this._ActivatedRoute.paramMap.subscribe({
            next:(res)=>{
                let product = res.get('productId');
                this._ProductService.getSpecificProducts(product).subscribe({
                    next:(res)=>{
                        this.isLoading = false
                        this.productData = res.data
                        this.productImages = res.data.images
                    },
                    error:(err)=>{
                        console.error(err);              
                        this.isLoading = false
                    }
                })
            }
        })
    }
    addToWishlist(event: MouseEvent , id:string ):void{
        event.stopPropagation(); // Prevent the click from propagating to the product card
        this._WishlistService.addToWishlist(id).subscribe({
            next:(res)=>{
                this._messageService.add({ severity: 'success', summary: 'Add to Wishlist', detail: 'Item added to wishlist successful', life: 3000 });
                this._WishlistService.wishcounter.next(res.data.length)
            },
            error:(err)=>{
                console.error(err);
                this._messageService.add({ severity: 'error', summary: 'Add to Wishlist', detail: 'Failed to add item to wishlist', life: 3000 });
            }
        })
    }

    addProductToCart(poductId:string, buyQuantity:number):void{
        this.buyQuantity = buyQuantity
        for (let index = 0; index < buyQuantity; index++) {
            setTimeout(() => {
                this._CartService.addProductToCart(poductId).subscribe({
                    next:(res)=>{
                        this._messageService.add({ severity: 'success', summary: 'Add to Cart', detail: 'Item added to cart successful', life: 3000 });
                        this._CartService.cartCount.next(res.numOfCartItems)
                    },
                    error:(err)=>{
                        console.error(err);
                    }
                })
            }, 1000);
        }

    }

    calculateRate(x:number){
        return Math.floor(x)
    }
    calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
        if (!originalPrice || originalPrice <= 0) return 0; 
        const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
        return Math.round(discount); 
    }

    ControlQuantity(quantity:number , key:number):void{
        if(key == 1 && quantity < 10){
            this.buyQuantity+= 1 ;
            console.log(this.buyQuantity);
            
        }
        else if(key == -1 && quantity > 1){
            this.buyQuantity-= 1 ;
            console.log(this.buyQuantity);
        }
      }

    ngOnDestroy(): void {
        // unsubscribe 
        this.getProductDetails?.unsubscribe()
    }




}
