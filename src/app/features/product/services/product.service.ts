import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  map,
  single,
  tap,
  throwError,
  BehaviorSubject,
} from 'rxjs';

import { API_URL, PAGE_SIZE } from '../../../core/constants/app.constants';
import { ProductModel } from '../model/product.model';
import { ProductResponseModel } from '../model/product-response.model';
import { ProductFilterModel } from '../model/product-filter.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private httpClient = inject(HttpClient);

  products = signal<ProductModel[]>([]);
  product = signal<ProductModel | null>(null);
  productResponse = signal<ProductResponseModel | null>(null);

  homeProducts = this.products.asReadonly();
  categorySelected = signal<number | null>(null);
  products$ = new BehaviorSubject<ProductModel[]>([]);
  isNextPage$ = new BehaviorSubject<boolean>(false);
  filterModal: ProductFilterModel = {
    pageNumber: 1,
    pageSize: PAGE_SIZE,
  };
  categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelected$ = this.categorySelectedSubject.asObservable();

  setCatSelected(catID: number){
    this.categorySelectedSubject.next(catID);
  }


  //currentPage$ = this.currentPageSubject.asObservable();

  //setCurrentPage(pageNumber: number){
  // this.currentPageSubject.next(pageNumber);
  //}

  totalPages = signal<number>(1);

  loadProductByFilter() {
    let url =
      API_URL +
      `/api/Products?pageNumber=${this.filterModal.pageNumber}&pageSize=${PAGE_SIZE}`;

    if (this.filterModal.searchText) {
      url += `&Search=` + this.filterModal.searchText;
    }
    if (this.filterModal.sortBy) {
      url += `&sortby=` + this.filterModal.sortBy;
    }

    if (this.filterModal.catID) {
      url += `&categoryId=${this.filterModal.catID}`;
    }

    return this.fetchProduct(
      url,
      'Something went wrong when loading product'
    ).subscribe({
      next: (data) => {
        this.products$.next(data ?? []);
      },
    });
  }
  // #region fetch API
  loadAvailableProduct(pageNumber: number) {
    let url =
      API_URL + `/api/Products/?pageNumber=${pageNumber}&pageSize=${PAGE_SIZE}`;
    return this.fetchProduct(
      url,
      'Something went wrong when loading product'
    ).pipe(
      tap((products) => {
        this.products.set(products ?? []);
        this.totalPages.set(products?.length ?? 1);
      })
    );
  }

  loadProductByCategory(catID: number, pageNumber: number) {
    return this.fetchProduct(
      API_URL +
        `/api/Products?${pageNumber}&pageSize=${PAGE_SIZE}&categoryId=${catID}`,
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
        this.totalPages.set(resData.totalPages);
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
