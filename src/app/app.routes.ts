import { Routes } from '@angular/router';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './shop/shop.component';
import { CartComponent } from './components/cart/cart.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
    {
        path:"",component:AuthLayoutComponent,canActivate:[loginGuard],
        children:[
            {path: '', redirectTo: 'login', pathMatch: 'full' },
            {path:"login",component:LoginComponent,title:"FreshCart | Login"},
            {path:"register",component:RegisterComponent,title:"FreshCart | Register"}
    ]},
     {
        path:"",component:MainLayoutComponent,
        children:[
            {path: '', redirectTo: 'home', pathMatch: 'full' },
            {path:"home",component:HomeComponent,title:"FreshCart | Home",canActivate:[authGuard]},
            {path:"shop",component:ShopComponent,title:"FreshCart | Shop"},
            {path:"cart",component:CartComponent,title:"FreshCart | Cart",canActivate:[authGuard]}
    ]},

    {
        path:"**",component:NotfoundComponent,title:"Not Found Page !"
    }
];
