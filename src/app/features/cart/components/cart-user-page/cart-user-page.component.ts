import {
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { CartService } from '../../services/cart.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CartItemPageComponent } from '../cart-item-page/cart-item-page.component';
import { CartItemInPageModel } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart-user-page',
  standalone: true,
  imports: [ReactiveFormsModule, CartItemPageComponent, DecimalPipe],
  templateUrl: './cart-user-page.component.html',
  styleUrl: './cart-user-page.component.css',
})
export class CartUserPageComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  listItems = signal<CartItemInPageModel[]>([]);
  totalQuantity = signal<number>(0);
  totalPrice = signal<number>(0);

  ngOnInit(): void {
    this.cartService.getListCartUserPage().subscribe({
      next: (data) => {
        this.listItems.set(data);

        const total = this.listItems().reduce((total, item)=>{
          return total + item.price * item.quantity
        }, 0)

        const quantity = this.listItems().reduce((total, item)=>{
          return total + item.quantity
        }, 0)

        this.totalPrice.set(total);
        this.totalQuantity.set(quantity);
      },
    });
  }
}
