import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly _HttpClient = inject(HttpClient);
  constructor() { }

  addAddress(data:any):Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/addresses`, data,
      {
        headers: {
          token: localStorage.getItem('userToken') || ''
        }
      }
    );
  }

  getAddresses():Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/addresses`,{
      headers: {
        token: localStorage.getItem('userToken') || ''
      }
    })
  }

  deleteAddress(AddressId:string):Observable<any>{
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/addresses/${AddressId}`,{
      headers: {
        token: localStorage.getItem('userToken') || ''
      }
    })
  }
}
