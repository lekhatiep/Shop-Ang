import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';

import { CartItemInPageModel, CartItemModel } from '../models/cart-item.model';
import { AuthService } from '../../auth/services/auth.service';
import { API_URL } from '../../../core/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  listCartSubject$ = new BehaviorSubject<CartItemModel[]>([]);
  listCart = signal<CartItemModel[]>([]);
  listCartLocal: CartItemModel[] = [];
  listCartUserPage = signal<CartItemInPageModel[]>([]);

  getListCart() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    };
    return this.httpClient
      .get<CartItemModel[]>(API_URL + '/api/Carts/GetListCart', options)
      .pipe(
        map((resData) => {
          this.listCart.set(resData);
          this.listCartSubject$.next(resData);
          return resData;
        }),
        catchError(() => throwError(() => Error('Cannot get list cart')))
      );
  }

  syncListCart(cat1: CartItemModel[], cart2: CartItemModel[]) {
    const syncCart = [...cat1];

    cart2.forEach((item) => {
      const existItem = syncCart.find((x) => x.productId === item.productId);
      if (existItem) {
        existItem.quantity += item.quantity;
      } else {
        syncCart.push(item);
      }
    });

    return syncCart;
  }

  getListCartLocal() {
    const listCartData = localStorage.getItem('listCart');
    let listCartLocal: CartItemModel[] = [];
    if (listCartData) {
      const listCartItem: CartItemModel[] = JSON.parse(listCartData);

      return (listCartLocal = listCartItem);
    } else {
      return [];
    }
  }

  removeCartItem(productID: number) {
    let listCartLocal = this.getListCartLocal();

    listCartLocal = listCartLocal.filter((x) => x.productId !== productID);
    console.log(this.authService.isLogged());

    //Remove in server
    if (this.authService.isLogged()) {
      console.log('remove server');

      localStorage.setItem('listCart', JSON.stringify(listCartLocal));
      this.removeCartItemFromListServer().subscribe();
    }
    //Remove in local
    else {
      console.log('remove local');
      localStorage.setItem('listCart', JSON.stringify(listCartLocal));
      this.listCartSubject$.next(listCartLocal);
    }
  }

  syncListCartItemToServer() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    };

    const data = this.getListCartLocal();

    return this.httpClient
      .post<CartItemModel[]>(API_URL + '/api/Carts/SyncListCart', data, options)
      .pipe(
        map((resData) => {
          this.listCart.set(resData);
          this.listCartSubject$.next(resData);
          return resData;
        }),
        catchError(() => throwError(() => Error('Cannot get list cart')))
      );
  }

  removeCartItemFromListServer() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    };

    const data = this.getListCartLocal();

    return this.httpClient
      .post<CartItemModel[]>(
        API_URL + '/api/Carts/UpdateOrRemoveCartItem',
        data,
        options
      )
      .pipe(
        map((resData) => {
          this.listCart.set(resData);
          this.listCartSubject$.next(resData);
          return resData;
        }),
        catchError(() => throwError(() => Error('Cannot get list cart')))
      );
  }

  setListCartLocal(listCart: CartItemModel[]) {
    localStorage.setItem('listCart', JSON.stringify(listCart));
  }

  getListCartUserPage() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    };

    return this.httpClient
      .get<CartItemInPageModel[]>(API_URL + '/api/Carts/GetListCart', options)
      .pipe(
        catchError(() => throwError(() => Error('loading user cart error')))
      );
  }
}
