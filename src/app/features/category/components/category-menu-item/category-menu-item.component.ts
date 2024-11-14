import { Component, Input } from '@angular/core';

import { CategoryModel } from '../../models/category.model';

@Component({
  selector: 'app-category-menu-item',
  standalone: true,
  imports: [],
  templateUrl: './category-menu-item.component.html',
  styleUrl: './category-menu-item.component.css'
})
export class CategoryMenuItemComponent {
  @Input({required: true}) category! : CategoryModel;
  @Input({required: true}) selected! : boolean;
}
