import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { CartItemInPageModel } from '../models/cart-item.model';
import { AuthService } from '../../auth/services/auth.service';
import { API_URL } from '../../../core/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class CartItemPageService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  updateItemInCart(cartItem: CartItemInPageModel) {
    const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`,
        }),
      };

    return this.httpClient
      .put<CartItemInPageModel[]>(API_URL + '/api/Carts/UpdateItemInCart', cartItem, options)
      .pipe(catchError(() => throwError(() => new Error('Update Failed'))));
  }
}
