import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';

import { CartItemModel } from '../models/cart-item.model';
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

  getListCart() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    };
    return this.httpClient
      .get<CartItemModel[]>(
        API_URL+'/api/Carts/GetListCart',
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
}
