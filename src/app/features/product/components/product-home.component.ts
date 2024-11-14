import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  signal,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ProductItemComponent } from './product-item/product-item.component';
import { ProductModel } from '../model/product.model';

import { ProductService } from '../services/product.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
@Component({
  selector: 'app-product-home',
  standalone: true,
  styleUrl: './product-home.component.css',
  templateUrl: './product-home.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [ProductItemComponent, PaginationComponent],
})
export class ProductHomeComponent implements OnInit {
  @Input() categoryId: number | null = null;

  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);
  private activatedRouter = inject(ActivatedRoute);
  private cdRef = inject(ChangeDetectorRef);

  error = signal('');
  isFetching = signal(false);

  products: ProductModel[] = [];
  productObservable: Observable<ProductModel[] | null> = new Observable();
  currentPage: number = 1;
  totalPages = this.productService.totalPages;

  ngOnInit(): void {
    console.log('init');
    
    this.isFetching.set(true);
    const sub = this.productService.products$.subscribe({
      next: (listProducts) => {
        this.products = listProducts;
        this.isFetching.set(false);
        this.cdRef.markForCheck();
      }
    });

    const subCatSelect = this.productService.categorySelected$.subscribe({
      next: (catId) => {
        console.log('cat');
        this.categoryId = catId;
        this.loadHomeProduct();
        this.cdRef.markForCheck();
      }
    
    });

    this.destroyRef.onDestroy(() => {
      
      sub.unsubscribe();
      subCatSelect.unsubscribe();
    });
  }

  loadHomeProduct() {
    //Load product by cat if router has catID
    this.productService.filterModal.catID = this.categoryId ?? 0;
    const subscription = this.productService.loadProductByFilter();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.productService.filterModal.pageNumber = page;
    this.loadHomeProduct(); // Load data for the selected page
  }
}
