import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

import { API_URL } from '../../../core/constants/app.constants';
import { ProductModel } from '../model/product.model';
import { ProductResponseModel } from '../model/product-response.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private httpClient = inject(HttpClient);

  products = signal<ProductModel[]>([]);

  homeProducts = this.products.asReadonly();
  
  loadAvailableProduct() {
    return this.fetchProduct(
      API_URL + '/api/Products?pageNumber=1&pageSize=12',
      'Something went wrong when loading product'
    ).pipe(tap((products)=> this.products.set(products ?? [])));
  }

  private fetchProduct(url: string, errorMessage: string) {
    return this.httpClient.get<ProductResponseModel>(url).pipe(
      map((resData) => {
        console.log(resData.data);
        console.log(resData);
        return resData.data;
      }),
      catchError(() => throwError(() => new Error(errorMessage)))
    );
  }
}
