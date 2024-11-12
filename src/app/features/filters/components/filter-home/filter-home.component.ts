import { Component, inject, OnInit } from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../../product/services/product.service';
import { ProductFilterModel } from '../../../product/model/product-filter.model';

@Component({
  selector: 'app-filter-home',
  standalone: true,
  templateUrl: './filter-home.component.html',
  styleUrl: './filter-home.component.css',
  imports: [FontAwesomeModule],
})
export class FilterHomeComponent implements OnInit {
  private productService = inject(ProductService);
  
  totalPages = this.productService.totalPages;
  sortBy : 'price_asc' | 'price_desc' | 'new_desc' | 'new_asc' | 'popular_desc' = 'price_asc'
  currentPage = 1;

  constructor(library: FaIconLibrary) {
    library.addIcons(faAngleLeft, faAngleRight);
  }
  ngOnInit(): void {
   // const sub = this.productService.products$.subscribe((data) => 
     // this.totalPages = data.length
  
  }

  onSortBy(sortBy: string){
    this.productService.filterModal.sortBy = sortBy;
    this.productService.loadProductByFilter()
  }

  nextPage(){
    if(this.currentPage < this.totalPages()){
      
      this.productService.filterModal.pageNumber = this.currentPage;
      this.productService.loadProductByFilter();
      this.productService.isNextPage$.next(true)
      this.currentPage++;
    }

  }

  prevPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.productService.filterModal.pageNumber = this.currentPage;
      this.productService.loadProductByFilter()
      this.productService.isNextPage$.next(false);
    }

  }
}
