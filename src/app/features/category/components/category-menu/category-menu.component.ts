import { Component, DestroyRef, EventEmitter, inject, OnInit, Output, signal, ViewEncapsulation } from '@angular/core';


import { CategoryMenuItemComponent } from "../category-menu-item/category-menu-item.component";
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../../product/services/product.service';

@Component({
  selector: 'app-category-menu',
  standalone: true,
  styleUrl: './category-menu.component.css',
  templateUrl: './category-menu.component.html',
  imports: [CategoryMenuItemComponent],
  encapsulation: ViewEncapsulation.None
})
export class CategoryMenuComponent implements OnInit {
  @Output() selectedCategory = new EventEmitter<number>();

  private categoryService = inject(CategoryService);
  private destroyRef = inject(DestroyRef);
  private productService = inject(ProductService);

  error = signal('');
  isFetching = signal(false);

  categories = this.categoryService.loadedCategories;
  selectedCatID = 0;

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

  onSelectCategory(catID : number){
    //this.selectedCategory.emit(catID);
    this.selectedCatID = catID;
    this.productService.setCatSelected(catID);
  }
}
