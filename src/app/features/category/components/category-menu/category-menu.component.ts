import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { CategoryService } from '../../services/category.service';
import { CategoryModel } from '../../models/category.model';
import { HttpClient } from '@angular/common/http';
import { CategoryResponse } from '../../models/category-response.model';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-category-menu',
  standalone: true,
  styleUrl: './category-menu.component.css',
  templateUrl: './category-menu.component.html',
})
export class CategoryMenuComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private destroyRef = inject(DestroyRef);

  error = signal('');
  isFetching = signal(false);

  categories = this.categoryService.loadedCategories;

  ngOnInit(): void {
    this.isFetching.set(true);

    const subscription = this.categoryService.loadAvailableCategories()
      .subscribe({
        // next: (data) => {
        //   console.log(data);
        //   this.categories.set(data);
        // },
        error: (error : Error) => {
          console.log(error);
          this.error.set(error.message);
        },
        complete: () => {
          this.isFetching.set(false);
        },
      });

    this.destroyRef.onDestroy(()=>{
        subscription.unsubscribe();
    })
  }
}
