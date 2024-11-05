import { Component, ViewEncapsulation } from '@angular/core';
import { CategoryMenuComponent } from "../../../features/category/components/category-menu/category-menu.component";
import { ProductHomeComponent } from "../../../features/product/components/product-home.component";
import { FilterHomeComponent } from "../../../features/filters/components/filter-home/filter-home.component";

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CategoryMenuComponent, ProductHomeComponent, FilterHomeComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ContainerComponent {

}
