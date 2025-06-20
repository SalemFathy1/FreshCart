import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CategoiresService } from '../../core/Services/categoires.service';
import { ProductService } from '../../core/Services/product.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../core/interfaces/iproduct';
import { WishlistService } from '../../core/Services/wishlist.service';
import { MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { CartService } from '../../core/Services/cart.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    RatingModule,
    CommonModule,
    NgxPaginationModule,
    SkeletonModule
  ],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {
  private readonly _CategoriesService = inject(CategoiresService);
  private readonly _ProductService = inject(ProductService);
  private readonly _WishlistService = inject(WishlistService);
  private readonly _CartService = inject(CartService);
  
  CategoriesList: any[] = [];
  productCount: number = 0;
  isLoading: boolean = false;
  getAllproductSub: Subscription = new Subscription();
  productsList: IProduct[] = [];
  categoryName: string = "All Products";
  itemsPerPage: number = 12;
  currentPage: number = 1;
  totalPages: number = 1;
  totalProducts: number = 0;
  itemsFound: number = 0;
  categoryEmpty: boolean = false;
  currentCategoryId: string | null = null;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getProducts();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.getAllproductSub.unsubscribe();
  }

  loadCategories(): void {
    this._CategoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.CategoriesList = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.isLoading = false;
      }
    });
  }

  getSpesificCategoryProducts(id: string, name: string): void {
    // Reset to first page when changing category
    this.currentPage = 1;
    this.categoryName = name;
    this.currentCategoryId = id;
    this.categoryEmpty = false;
    this.isLoading = true;
    this.getProducts(id);
  }

  getRandom(): number {
    return Math.floor(Math.random() * 4) + 8;
  }

  getProducts(id?: string): void {
    this.getAllproductSub.unsubscribe(); // Cancel any pending request
    
    this.getAllproductSub = this._ProductService.getAllProducts(
      this.currentPage,
      this.itemsPerPage,
      id
    ).subscribe({
      next: (res) => {
        this.productsList = res.data;
        this.categoryEmpty = res.data.length === 0;
        
        if (!this.categoryEmpty) {
          this.currentPage = res.metadata.currentPage;
          this.totalPages = res.metadata.numberOfPages;
          this.itemsPerPage = res.metadata.limit;
          this.totalProducts = res.results;
          this.itemsFound = res.results;
        } else {
          // Reset pagination for empty categories
          this.currentPage = 1;
          this.totalPages = 1;
          this.totalProducts = 0;
          this.itemsFound = 0;
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.categoryEmpty = true;
      }
    });
  }

  changePageProductLimit(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    
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
    this.getProducts(this.currentCategoryId || undefined);
  }

  addToWishlist(event: MouseEvent, id: string): void {
    event.stopPropagation();
    this._WishlistService.addToWishlist(id).subscribe({
      next: (res) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Add to Wishlist', 
          detail: 'Item added to wishlist successful', 
          life: 3000 
        });
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Add to Wishlist', 
          detail: 'Failed to add item to wishlist', 
          life: 3000 
        });
      }
    });
  }

  calculateRate(x: number): number {
    return Math.floor(x);
  }

  calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    if (!originalPrice || originalPrice <= 0) return 0;
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  }

  addProductToCart(productId: string): void {
    this._CartService.addProductToCart(productId).subscribe({
      next: (res) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Add to Cart', 
          detail: 'Item added to cart successful', 
          life: 3000 
        });
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Add to Cart', 
          detail: 'Failed to add item to cart', 
          life: 3000 
        });
      }
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    this.getProducts(this.currentCategoryId || undefined);
  }
}