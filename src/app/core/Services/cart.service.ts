import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _HttpClient = inject(HttpClient)
  myHeader:any = {token : localStorage.getItem('userToken')}

  addProductToCart(productID:string):Observable<any>{
   return this._HttpClient.post(`${environment.baseUrl}/api/v1/cart`, { productId: `${productID}` } , {headers: this.myHeader} ) 
  }

  getUserCartProducts():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/cart` , {headers:this.myHeader} )
  }


  removeSpecificCartProduct(id:string):Observable<any>{
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart/${id}`,{headers:this.myHeader})
  }

  updateProductQuantity(id:string,newCount:number):Observable<any>{
    return this._HttpClient.put(`${environment.baseUrl}/api/v1/cart/${id}`,{count : newCount },{headers:this.myHeader})
  }

  clearCartItems():Observable<any>{
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart`,{headers:this.myHeader})
  }
}
