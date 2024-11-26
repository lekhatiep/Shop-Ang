import { Component, DestroyRef, inject, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { ProductModel } from '../../model/product.model';
import { ProductService } from '../../services/product.service';
import { ProductItemComponent } from "../product-item/product-item.component";

@Component({
  selector: 'app-product-by-cat',
  standalone: true,
  imports: [ProductItemComponent],
  templateUrl: './product-by-cat.component.html',
  styleUrl: './product-by-cat.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProductByCatComponent {
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);
  private activatedRouter = inject(ActivatedRoute);

  error = signal('');
  isFetching = signal(false);
  public catID: number | null = null;
  products = this.productService.homeProducts;
  productObservable: Observable<ProductModel[] | null> = new Observable();
  private routeSubscription!: Subscription;
  
  ngOnInit(): void {
    //this.getHomeProduct()
    this.isFetching.set(true);

    this.routeSubscription = this.activatedRouter.params.subscribe(params => {
      this.catID = +params['catID']; // Update the catID from the route
      this.loadCategoryProducts(); // Your logic to load products based on the catID
    });

    // this.activatedRouter.paramMap.subscribe({
    //   next: (paramMap) => (this.catID = paramMap.get('catID') ?? ''),
    // });

    // //Load product by cat if router has catID
    // if (+this.catID > 0) {
    //   console.log('load cat product', this.catID);
    //   this.productObservable = this.productService.loadProductByCategory(
    //     +this.catID
    //   );
    // } else {
    //   this.productObservable = this.productService.loadAvailableProduct();
    // }

    // const subscription = this.productObservable.subscribe({
    //   error: (error) => this.error.set(error.message),
    //   complete: () => this.isFetching.set(false),
    // });

    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // });
  }

  loadCategoryProducts() {
    //const catID = Number(this.activatedRouter.snapshot.paramMap.get('catID'));
    //Load product by cat if router has catID
    if (this.catID) {
      console.log('load cat product', this.catID);
      this.productObservable = this.productService.loadProductByCategory(
        +this.catID,
        5
      );
    } else {
      //this.productObservable = this.productService.loadAvailableProduct();
    }

    const subscription = this.productObservable.subscribe({
      error: (error: { message: any; }) => this.error.set(error.message),
      complete: () => this.isFetching.set(false),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
