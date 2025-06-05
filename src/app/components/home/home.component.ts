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

@Component({
    selector: 'app-home',
    imports: [ButtonModule,Rating,CommonModule,FormsModule,RouterLink,SkeletonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit,OnDestroy {
    @ViewChild ('swiper') CatSwiper!:SwiperContainer
    private readonly _CategoiresService = inject(CategoiresService)
    private readonly _ProductService = inject(ProductService)
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
        console.log(this.isLoading);
        
        this.getProducts()
        console.log(this.isLoading);

    }

    getCategoies():void{
        this.isLoading = true
        this._CategoiresService.getAllCategories().subscribe({
            next:(res)=>{
                this.categoriesList = res.data 
                console.log(res.data);
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
                console.log(this.productsList);
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
    ngOnDestroy(): void {
        // unsubscribe 
        this.getAllproductSub?.unsubscribe()
    }
}
