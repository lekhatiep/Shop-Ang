import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ContainerComponent } from './core/layout/container/container.component';
import { ProductHomeComponent } from './features/product/components/product-home.component';
import { ProductByCatComponent } from './features/product/components/product-by-cat/product-by-cat.component';
import { ProductDetailComponent } from './features/product/components/product-detail/product-detail.component';
import { SignupComponent } from './features/auth/signup/signup.component';

export const routes: Routes = [
  {
    path: '', //<your-domain>/
    component: ContainerComponent,
  },
  {
    path: 'product/:productID', //<your-domain>/product/<productID>,
    component: ProductDetailComponent,
  },
  {
    path: 'login', //<your-domain>/login
    component: LoginComponent,
  },
  {
    path: 'signup', //<your-domain>/signup
    component: SignupComponent,
  },
];
