import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CategoiresService } from '../../core/Services/categoires.service';
import { ProductService } from '../../core/Services/product.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../core/interfaces/iproduct';
import { WishlistService } from '../../core/Services/wishlist.service';
import { MessageService } from 'primeng/api';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { CartService } from '../../core/Services/cart.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-shop',
    imports: [FormsModule,RouterLink,RatingModule,CommonModule,NgxPaginationModule,SkeletonModule,RouterLinkActive],
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
    private readonly _CategoriesService = inject(CategoiresService)
    private readonly _ProductService = inject(ProductService)
    private readonly _WishlistService = inject(WishlistService)
    private readonly _CartService = inject(CartService)
    
    CategoriesList : any[] = []
    productCount : number = 0;
    isLoading: boolean = false;
    getAllproductSub: Subscription = new Subscription();
    productsList:IProduct[] = [];
    categoryName: string = "All Products"
    itemsPerPage: number = 12;
    currentPage: number = 1;
    totalPages: number = 50;
    totalProducts: number = 0;
    itemsFound :number = 0
    categoryEmpty : boolean = false
    

    constructor( private messageService:MessageService) {}
    ngOnInit(): void {
        this.isLoading = true
        this.getProducts();
        this._CategoriesService.getAllCategories().subscribe({
            next: (res) => {
                console.log(res);
                this.isLoading = false
                this.CategoriesList = res.data;
            },
            error: (err) => {
                console.error('Error fetching categories:', err);
            }
        });
    }

    getSpesificCategoryProducts(id : string , name:string){
        this.getProducts(id)
        this.categoryName =   name
    }

    get getRandom():number{
        return Math.floor(Math.random() * 4) + 8;
    }
    getProducts(id?:string):void{
        this.isLoading = true
        this.getAllproductSub = this._ProductService.getAllProducts(this.currentPage ,this.itemsPerPage , id ).subscribe({
            next:(res)=>{
                this.productsList = res.data
                if(!res.data[1]){
                    this.categoryEmpty = true
                }
                this.isLoading = false
                this.currentPage = res.metadata.currentPage
                this.totalPages = res.metadata.numberOfPages
                this.itemsPerPage = res.metadata.limit
                this.totalProducts = res.results
                this.itemsFound = res.results

            },error:(err)=>{
                this.isLoading = false
            }
        })
    }
    changePageProductLimit(event: Event): void {
        this.getProducts()
        const selectElement = event.target as HTMLSelectElement;
        const value = selectElement.value;
        
        // Map the selected value to the number of products
        switch(value) {
          case '1':
            this.itemsPerPage = 24;
            break;
          case '2':
            this.itemsPerPage = 36;
            break;
          default:
            this.itemsPerPage = 12;
        }
        
        this.currentPage = 1; // Reset to first page when changing limit
        this.getProducts();
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
            },
            error:(err)=>{
                console.log(err);
            }
        })
    }
    pageChanged(event: any): void {
        this.currentPage = event;
        this.getProducts();
    }
}
