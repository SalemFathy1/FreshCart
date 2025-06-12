import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly _HttpClient = inject(HttpClient);
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
}
