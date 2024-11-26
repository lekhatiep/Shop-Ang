import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CartItemModel } from '../models/cart-item.model';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  listCartSubject$ = new BehaviorSubject<CartItemModel[]>([]);
  listCart = signal<CartItemModel[]>([]);
  listCartLocal : CartItemModel[] = [];

  getListCart() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    };
    return this.httpClient
      .get<CartItemModel[]>(
        'https://localhost:5001/api/Carts/GetListCart',
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

  getListCartLocal(){
    const listCartData = localStorage.getItem('listCart');
    let listCartLocal : CartItemModel[] = [];
    if (listCartData) {
      const listCartItem: CartItemModel[] = JSON.parse(listCartData);

       return listCartLocal = listCartItem;
    }else{
      return [];
    }
  }

  removeCartItem(productID: number){

    let listCartLocal = this.getListCartLocal();
    
    listCartLocal = listCartLocal.filter(x=> x.productId !== productID);

    const cartUpdated = this.syncListCart(listCartLocal, this.listCart())

    localStorage.setItem('listCart', JSON.stringify(cartUpdated));
    this.listCartSubject$.next(cartUpdated);

  }

  syncListCartItemToServer(){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    };

    const data = this.getListCartLocal();
    
    this.listCart;


    return this.httpClient
      .post<CartItemModel[]>(
        'https://localhost:5001/api/Carts/SyncListCart',
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
}
