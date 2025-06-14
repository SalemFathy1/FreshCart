import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly _HttpClient = inject(HttpClient)


  getAllProducts(page?:number , limit?:number , category?:string):Observable<any>{
    if(category){
      return this._HttpClient.get(`${environment.baseUrl}/api/v1/products?limit=${ limit ? limit : 8}&page=${page ? page : 1}&category=${category}`)
    }else{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/products?limit=${ limit ? limit : 8}&page=${page ? page : 1}`)
    }
  }

  getSpecificProducts(id:string | null):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/products/${id}`)
  }
}
