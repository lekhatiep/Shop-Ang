import { Component, DestroyRef, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductItemComponent } from "./product-item/product-item.component";

@Component({
  selector: 'app-product-home',
  standalone: true,
  styleUrl: './product-home.component.css',
  templateUrl: './product-home.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [ProductItemComponent]
})
export class ProductHomeComponent implements OnInit {
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);
  error = signal('');
  isFetching = signal(false);

  products = this.productService.homeProducts;

  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.productService.loadAvailableProduct().subscribe({
      error: (error) => this.error.set(error.message),
      complete: () => this.isFetching.set(false),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
