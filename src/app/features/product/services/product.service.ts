import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, single, tap, throwError, BehaviorSubject } from 'rxjs';

import { API_URL, PAGE_SIZE } from '../../../core/constants/app.constants';
import { ProductModel } from '../model/product.model';
import { ProductResponseModel } from '../model/product-response.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private httpClient = inject(HttpClient);

  products = signal<ProductModel[]>([]);
  product = signal<ProductModel | null>(null);
  productResponse = signal<ProductResponseModel | null>(null);

  homeProducts = this.products.asReadonly();
  categorySelected = signal<number | null>(null);
  products$ = new BehaviorSubject<ProductModel[]>([]);

  // #region fetch API
  loadAvailableProduct(pageNumber: number, searchText?: string) {

    
    let url =
      API_URL + `/api/Products?pageNumber=${pageNumber}&pageSize=${PAGE_SIZE}`;

    if (searchText) {
      url += `?Search=` + searchText;
    }
    console.log('search');
    const data = this.fetchProduct(
      url,
      'Something went wrong when loading product'
    ).pipe(tap((products) => {
      this.products.set(products ?? [])
      this.products$.next([...this.products()])
      console.log(this.products$);
      
    }
    ));

   
    return data;
    
  }

  loadProductByCategory(catID: number, pageNumber: number) {
    return this.fetchProductByCategory(
      catID,
      API_URL +
        `/api/Products/GetProductByCategory?${pageNumber}&pageSize=${PAGE_SIZE}`,
      'Something went wrong when loading product'
    ).pipe(tap((products) => this.products.set(products ?? [])));
  }

  loadProductByID(productID: number) {
    return this.fetchProductByID(
      API_URL + '/api/Products/' + productID,
      'Something went wrong when loading product'
    ).pipe(tap((product) => this.product.set(product)));
  }
  // #endregion

  // #region fetch API
  private fetchProductByCategory(
    catID: number,
    url: string,
    errorMessage: string
  ) {
    return this.httpClient
      .get<ProductResponseModel>(url + `&categoryId=${catID}`)
      .pipe(
        map((resData) => {
          this.productResponse.set(resData);
          return resData.data;
        }),
        catchError(() => throwError(() => new Error(errorMessage)))
      );
  }

  private fetchProduct(url: string, errorMessage: string) {
    return this.httpClient.get<ProductResponseModel>(url).pipe(
      map((resData) => {
        this.productResponse.set(resData);
        return resData.data;
      }),
      catchError(() => throwError(() => new Error(errorMessage)))
    );
  }

  private fetchProductByID(url: string, errorMessage: string) {
    return this.httpClient.get<ProductModel>(url).pipe(
      map((data) => {
        return data;
      }),
      catchError(() => throwError(() => new Error(errorMessage)))
    );
  }

  private fetchProductAPI<T>(
    dataResponse: T,
    url: string,
    errorMessage: string
  ) {
    return this.httpClient.get<typeof dataResponse>(url).pipe(
      map((resData) => {
        return resData;
      }),
      catchError(() => throwError(() => new Error(errorMessage)))
    );
  }
  // #endregion
}
