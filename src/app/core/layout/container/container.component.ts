import { Component, inject, ViewEncapsulation } from '@angular/core';

import { CategoryMenuComponent } from '../../../features/category/components/category-menu/category-menu.component';
import { ProductHomeComponent } from '../../../features/product/components/product-home.component';
import { FilterHomeComponent } from '../../../features/filters/components/filter-home/filter-home.component';
import { LoginComponent } from '../../../features/auth/login/login.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { ProductService } from '../../../features/product/services/product.service';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    CategoryMenuComponent,
    ProductHomeComponent,
    FilterHomeComponent,
    RouterOutlet,
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ContainerComponent {
  selectedCategoryId: number | null = null;
  
  onMenuCategorySelect(catID: number) {
    this.selectedCategoryId = catID;
  }
}
