import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { CategoryModel } from '../../models/category.model';

@Component({
  selector: 'app-category-menu-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './category-menu-item.component.html',
  styleUrl: './category-menu-item.component.css'
})
export class CategoryMenuItemComponent {
  @Input({required: true}) category! : CategoryModel;
}
