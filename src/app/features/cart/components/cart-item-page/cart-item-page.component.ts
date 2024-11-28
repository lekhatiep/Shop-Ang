import { Component, Input } from '@angular/core';
import { CartItemInPageModel } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart-item-page',
  standalone: true,
  imports: [],
  templateUrl: './cart-item-page.component.html',
  styleUrl: './cart-item-page.component.css'
})
export class CartItemPageComponent {
  @Input({required: true}) cartItem! : CartItemInPageModel;
  active = true;
}
