import { Routes } from '@angular/router';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './shop/shop.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
    {
        path:"",
        redirectTo:"home",
        pathMatch:"full"
    },
    {
        path:"",
        component:MainLayoutComponent,
        children:[
            {
                path:"home",
                component:HomeComponent,
                title:"FreshCart | Home"
            },
            {
                path:"shop",
                component:ShopComponent,
                title:"FreshCart | Shop"
            },
            {
                path:"cart",
                component:CartComponent,
                title:"FreshCart | Cart"
            }
    ]},
    {
        path:"**",
        component:NotfoundComponent,
        title:"Not Found Page !"
    }
];
