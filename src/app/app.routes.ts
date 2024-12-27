import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ContainerComponent } from './core/layout/container/container.component';
import { ProductHomeComponent } from './features/product/components/product-home.component';
import { ProductByCatComponent } from './features/product/components/product-by-cat/product-by-cat.component';
import { ProductDetailComponent } from './features/product/components/product-detail/product-detail.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { ErrorHandler, inject } from '@angular/core';
import { NumberCheckGuard } from './shared/guards/number-check.guard';
import { CartUserPageComponent } from './features/cart/components/cart-user-page/cart-user-page.component';

export const routes: Routes = [
  {
    path: '', //<your-domain>/
    title: 'Home page',
    component: ContainerComponent,
  },
  {
    path: 'product/:productID', //<your-domain>/product/<productID>,
    title: 'Product Detail',
    canActivate: [NumberCheckGuard],
    component: ProductDetailComponent,
  },
  {
    path: 'login', //<your-domain>/login
    title: 'Login',
    component: LoginComponent,
  },
  {
    path: 'signup', //<your-domain>/signup
    component: SignupComponent,
  },
  {
    path: 'page-not-found', //<your-domain>/page-not-found
    component: PageNotFoundComponent,
  },
  {
    path: 'cart', //<your-domain>/cart
    title: 'Cart',
    component: CartUserPageComponent
  },

  //NOTE: path ** always in end position 
  {
    path: '**', 
    redirectTo: 'page-not-found'
  }  
];
