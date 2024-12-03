import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CartItemInPageModel } from '../../models/cart-item.model';
import { DecimalPipe } from '@angular/common';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-cart-item-page',
  standalone: true,
  imports: [DecimalPipe, FontAwesomeModule],
  templateUrl: './cart-item-page.component.html',
  styleUrl: './cart-item-page.component.css',
})
export class CartItemPageComponent {
  @Input({ required: true }) cartItem!: CartItemInPageModel;
  @ViewChild('currentQuantity') currentQuantityElement!: ElementRef;
  active = true;

  constructor(private iconFeb: FaIconLibrary) {
    iconFeb.addIcons(faMinus, faPlus);
  }

  onIncreaseQuantity() {
    let currentVal = this.currentQuantityElement.nativeElement.value;
      if (currentVal > 0) {
        this.currentQuantityElement.nativeElement.value =
          +this.currentQuantityElement.nativeElement.value + 1;
      }
  }

  onDecreaseQuantity() {
    let currentVal = this.currentQuantityElement.nativeElement.value;
    if (currentVal > 0) {
      this.currentQuantityElement.nativeElement.value =
        +this.currentQuantityElement.nativeElement.value - 1;
    }
  }

  onChangeCheckItem(event: Event) {
    const inputEL = event.target as HTMLInputElement;
    console.log(inputEL.checked);
  }
}
