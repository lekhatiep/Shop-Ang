import { Component, inject, Input } from '@angular/core';
import { CartItemModel } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
  @Input({ required: true }) cartItem!: CartItemModel;
  private cartService = inject(CartService);

  remove(productID: number) {
    this.cartService.removeCartItem(productID);
  }
}
