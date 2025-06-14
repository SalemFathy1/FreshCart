import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly _HttpClient = inject(HttpClient);
  constructor() { }
  header : any = {"token" : localStorage.getItem('userToken')};
  wishcounter : BehaviorSubject<number> = new BehaviorSubject(0)

  getWishlist():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/wishlist` , 
      {headers: this.header }
    );
  }
  addToWishlist(productId: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/wishlist`, { 'productId' : productId }, 
      { headers: this.header }
    );
  }

  removeFromWishlist(productId: string): Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${productId}`, 
      { headers: this.header }
    );
  }
}
