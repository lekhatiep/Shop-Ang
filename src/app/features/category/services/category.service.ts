import { DestroyRef, inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

import { API_URL } from '../../../core/constants/app.constants';
import { CategoryModel } from '../models/category.model';
import { CategoryResponse } from '../models/category-response.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private httpClient = inject(HttpClient);

  dummyData: CategoryModel[] = [
    {
      id: 2,
      name: 'Đồ gia dụng',
      createTime: '0001-01-01T00:00:00',
      modifyTime: '0001-01-01T00:00:00',
      isDelete: false,
    },
    {
      id: 3,
      name: 'Thời trang',
      createTime: '0001-01-01T00:00:00',
      modifyTime: '0001-01-01T00:00:00',
      isDelete: false,
    },
    {
      id: 4,
      name: 'Đồ dùng nhà bếp',
      createTime: '0001-01-01T00:00:00',
      modifyTime: '0001-01-01T00:00:00',
      isDelete: false,
    },
  ];

  categories = signal<CategoryModel[]>([
    {
      id: 0,
      name: 'Tất cả'
    }
  ]);
  loadedCategories = this.categories.asReadonly();

  loadAvailableCategories() {
    return this.fetchCategory(
      API_URL + '/api/Categories?pageNumber=1&pageSize=20',
      'Something went wrong when fetching...'
    ).pipe(tap({
        next: (data)=>
            this.categories.set( [...this.categories(),...data ?? []] )
        
    }));
  }

  private fetchCategory(url: string, errorMessage: string) {
    return this.httpClient.get<CategoryResponse>(url).pipe(
      map((resData) => {
        return resData?.data;
      }),
      catchError((error) => throwError(() => new Error(errorMessage)))
    );
  }
}
