import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './Authentication/auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly _AuthService = inject(AuthService);
  header : any = {"token" : localStorage.getItem('userToken')};


  CheckOut(cartId: string, address: any):Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${environment.baseHost}`, 
      {
        "shippingAddress": address
      },
      {headers: this.header }
    );
  }

  CashPay(cartId: string, address: any):Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/orders/${cartId}`, 
      {
        "shippingAddress": address
      },
      {headers: this.header }
    );
  }

  getUserOrders(userID : string):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/orders/user/${userID}`)
  }
}
