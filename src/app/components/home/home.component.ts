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

@Component({
    selector: 'app-home',
    imports: [ButtonModule,Rating,CommonModule,FormsModule,RouterLink],
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
    categoriesList!:any[] 
    productsList!:any[] 
    getAllproductSub!:Subscription

    ngOnInit(): void {
        this.getCategoies()
        this.getProducts()
    }

    getCategoies():void{
        this._CategoiresService.getAllCategories().subscribe({
            next:(res)=>{
                this.categoriesList = res.data  
            },
            error:(err)=>{
            }
        })
    }
    getProducts():void{
        this.getAllproductSub = this._ProductService.getAllProducts().subscribe({
            next:(res)=>{
                this.productsList = res.data
                console.log(this.productsList);
            },error:(err)=>{
            }
        })
    }
    calculateRate(x:number){
        return Math.floor(x)
    }
    ngOnDestroy(): void {
        // unsubscribe 
        this.getAllproductSub?.unsubscribe()
    }
}
