import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faAngleDown,
  faAnglesUp,
  faAnglesDown,
  faArrowTrendUp,
} from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../../product/services/product.service';
import { ProductFilterModel } from '../../../product/model/product-filter.model';
import { PaginationService } from '../../../../shared/components/pagination/pagination.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-home',
  standalone: true,
  templateUrl: './filter-home.component.html',
  styleUrl: './filter-home.component.css',
  imports: [FontAwesomeModule,CommonModule],
})
export class FilterHomeComponent implements OnInit {
  private productService = inject(ProductService);
  private paginationService = inject(PaginationService);
  private destroyRef = inject(DestroyRef);

  totalPages = this.productService.totalPages;
  sortBys: string | 'price_asc' | 'price_desc' | 'new_desc' | 'new_asc' | 'popular_desc' =
    '';
  currentPage = 1;
  isFilterPrice = false;
  isFilterTrend = false;
  isFilterNewest = true;

  constructor(library: FaIconLibrary) {
    library.addIcons(
      faAngleLeft,
      faAngleRight,
      faAnglesUp,
      faAngleDown,
      faAnglesDown,
      faArrowTrendUp
    );
  }
  ngOnInit(): void {
    const sub = this.paginationService.currentPage$.subscribe({
      next: (value) => (this.currentPage = value),
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  onSortBy(sortBy: typeof this.sortBys) {

    this.sortBys = sortBy;
    if(sortBy == 'price_asc' || sortBy === 'price_desc'){
      this.isFilterPrice = true;
      this.isFilterNewest = false;
      this.isFilterTrend = false;
    }
    if(sortBy == 'new_desc' || sortBy == 'new_asc'){
      this.isFilterNewest = true;
      this.isFilterPrice = false;
     // this.isFilterNewest = !this.isFilterNewest;
      this.isFilterTrend = false;
    }
    if(sortBy == 'popular_desc'){
      this.isFilterTrend = true;
      this.isFilterPrice = false;
      this.isFilterNewest = false;
     // this.isFilterTrend = !this.isFilterTrend;
    }
    
    this.productService.filterModal.sortBy = sortBy;
    this.productService.loadProductByFilter();
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.productService.filterModal.pageNumber = this.currentPage;
      this.productService.loadProductByFilter();
      this.productService.isNextPage$.next(true);
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.productService.filterModal.pageNumber = this.currentPage;
      this.productService.loadProductByFilter();
      this.productService.isNextPage$.next(false);
    }
  }
}
