import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CategoiresService } from '../../core/Services/categoires.service';
import { Rating } from 'primeng/rating';
import { ProductService } from '../../core/Services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SwiperContainer } from 'swiper/element';
import { RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { IProduct } from '../../core/interfaces/iproduct';
import { CartService } from '../../core/Services/cart.service';
import { MessageService } from 'primeng/api';
import { WishlistService } from '../../core/Services/wishlist.service';

@Component({
    selector: 'app-home',
    imports: [ButtonModule,Rating,CommonModule,FormsModule,RouterLink,SkeletonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit,OnDestroy {
    constructor(private messageService: MessageService) {}
    @ViewChild ('swiper') CatSwiper!:SwiperContainer
    private readonly _CategoiresService = inject(CategoiresService)
    private readonly _ProductService = inject(ProductService)
    private readonly _CartService = inject(CartService)
    private readonly _WishlistService = inject(WishlistService)

    initProduct = Math.floor(Math.random() * 20)
    lastProduct = this.initProduct + 12
    randomFakeSale = Math.floor(Math.random() * 200)
    categoriesList:any[] = []
    productsList:IProduct[] = [

    ] 
    getAllproductSub!:Subscription
    isLoading:boolean = false

    ngOnInit(): void {
        this.getCategoies()
        this.getProducts()
    }

    getCategoies():void{
        this.isLoading = true
        this._CategoiresService.getAllCategories().subscribe({
            next:(res)=>{
                this.categoriesList = res.data 
                this.isLoading = false

            },
            error:(err)=>{
                this.isLoading = false

            }
        })
    }
    getProducts():void{
        this.isLoading = true
        this.getAllproductSub = this._ProductService.getAllProducts().subscribe({
            next:(res)=>{
                this.productsList = res.data
                this.isLoading = false

            },error:(err)=>{
                this.isLoading = false
            }
        })
    }
    calculateRate(x:number){
        return Math.floor(x)
    }
    calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
        if (!originalPrice || originalPrice <= 0) return 0; 
        const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
        return Math.round(discount); 
    }
    addProductToCart(poductId:string):void{
        this._CartService.addProductToCart(poductId).subscribe({
            next:(res)=>{
                console.log(res);
                console.log(poductId);
                this.messageService.add({ severity: 'success', summary: 'Add to Cart', detail: 'Item added to cart successful', life: 3000 });
                this._CartService.cartCount.next(res.numOfCartItems)
            },
            error:(err)=>{
                console.log(err);
            }
        })
    }
    addToWishlist(event: MouseEvent , id:string):void{
        event.stopPropagation(); // Prevent the click from propagating to the product card
        this._WishlistService.addToWishlist(id).subscribe({
            next:(res)=>{
                console.log(res);
                this.messageService.add({ severity: 'success', summary: 'Add to Wishlist', detail: 'Item added to wishlist successful', life: 3000 });
            },
            error:(err)=>{
                console.log(err);
                this.messageService.add({ severity: 'error', summary: 'Add to Wishlist', detail: 'Failed to add item to wishlist', life: 3000 });
            }
        })
    }
    ngOnDestroy(): void {
        // unsubscribe 
        this.getAllproductSub?.unsubscribe()
    }
}
