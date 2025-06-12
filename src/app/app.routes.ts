import { Routes } from '@angular/router';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { CartComponent } from './components/cart/cart.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { ProductComponent } from './components/product/product.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { OrderComponent } from './components/order/order.component';

export const routes: Routes = [
    {
        path:"",component:AuthLayoutComponent,canActivate:[loginGuard],
        children:[
            {path: '', redirectTo: 'login', pathMatch: 'full' },
            {path:"login",component:LoginComponent,title:"FreshCart | Login"},
            {path:"register",component:RegisterComponent,title:"FreshCart | Register"},
            {path:"forgetpassword",component:ForgetpasswordComponent,title:"FreshCart | ForgetPassword"}
    ]},
     {
        path:"",component:MainLayoutComponent,canActivate:[authGuard],
        children:[
            {path: '', redirectTo: 'home', pathMatch: 'full' },
            {path:"home",component:HomeComponent,title:"FreshCart | Home"},
            {path:"account",component:AccountDetailsComponent,title:"FreshCart | Account Details"},
            {path:"shop",component:ShopComponent,title:"FreshCart | Shop"},
            {path:"cart",component:CartComponent,title:"FreshCart | Cart"},
            {path:"details/:productId",component:ProductComponent,title:"FreshCart | Product Details"},
            {path:"wishlist",component:WishlistComponent,title:"FreshCart | wishlist"},
            {path:"allorders",component:MyOrdersComponent,title:"FreshCart | My Orders"},
            {path:"order/:cartid",component:OrderComponent,title:"FreshCart | Order"}

    ]},

    {
        path:"**",component:NotfoundComponent,title:"Not Found Page !"
    }
];
