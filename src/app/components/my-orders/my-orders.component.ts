import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { OrdersService } from '../../core/Services/orders.service';
import { AuthService } from '../../core/Services/Authentication/auth.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-my-orders',
  imports: [RouterLink,SkeletonModule,CommonModule,BadgeModule,DialogModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit{
  private readonly _OrdersService = inject(OrdersService)
  private readonly _AuthService = inject(AuthService)
orderList!:any[]
active : string = 'all'
isLoading:boolean = false
myOrders:any[] = []
orderItems:any[] = []
myCompletedOrders:any[] = []
pendingOrders:any[] = []
allOrdersNumber!:number
CompletedOrdersNumber!:number
dialogVisibility: { [key: string]: boolean } = {};

ngOnInit(): void {
  this.filterOrders();
}

filterOrders(key?:string):void{
  this._OrdersService.getUserOrders(this._AuthService.userData.id).subscribe({
    next:(res)=>{
      this.myOrders = res
      this.orderItems = res.cartItems
      this.myCompletedOrders = this.myOrders.filter((order)=> order.isPaid == true && order.isDelivered == true)
      this.pendingOrders = this.myOrders.filter((order)=> order.isDelivered == false)
      this.allOrdersNumber = res.length
    },
    error:(err)=>{
      console.log(err);
    }
  })
}
toggleDialog(orderId: string): void {
  this.dialogVisibility[orderId] = !this.dialogVisibility[orderId];
}

}
