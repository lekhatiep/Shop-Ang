import {
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
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
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

  error = signal('');
  isFetching = signal(false);
  products = this.productService.homeProducts;
  productObservable: Observable<ProductModel[] | null> = new Observable();
  currentPage: number = 1;
  totalPages: number = 1;

  ngOnInit(): void {
    this.isFetching.set(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes['categoryId']) {
      this.loadHomeProduct(this.categoryId);
      
    }
  }

  loadHomeProduct(categoryId: number | null) {
    //Load product by cat if router has catID
   
    if (categoryId) {
      this.productObservable = this.productService.loadProductByCategory(
        categoryId,
        this.currentPage
      );
    } else {
      this.productObservable = this.productService.loadAvailableProduct(this.currentPage);
    }

    const subscription = this.productObservable.subscribe({
      error: (error) => this.error.set(error.message),
      complete: () => {this.isFetching.set(false),
        this.totalPages = this.productService.productResponse()?.totalPages ?? 0
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onPageChange(page: number) {
    
    this.currentPage = page;
    this.loadHomeProduct(this.categoryId); // Load data for the selected page
  }

}
