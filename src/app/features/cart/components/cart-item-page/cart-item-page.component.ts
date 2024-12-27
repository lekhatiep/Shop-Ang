import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CartItemInPageModel } from '../../models/cart-item.model';
import { DecimalPipe } from '@angular/common';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { CartItemPageService } from '../../services/cart-item-page.service';
import { CartService } from '../../services/cart.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../auth/services/auth.service';
@Component({
  selector: 'app-cart-item-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FontAwesomeModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
  ],
  templateUrl: './cart-item-page.component.html',
  styleUrl: './cart-item-page.component.css',
  providers: [ConfirmationService, MessageService],
})
export class CartItemPageComponent {
  @Input({ required: true }) cartItem!: CartItemInPageModel;
  @ViewChild('currentQuantity') currentQuantityElement!: ElementRef;

  private cartItemPageService = inject(CartItemPageService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  isLogged = this.authService.isLogged;
  listItemsLocal = this.cartService.getListCartLocal();

  constructor(
    private iconFeb: FaIconLibrary,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    iconFeb.addIcons(faMinus, faPlus);
  }

  onIncreaseQuantity() {
    this.currentQuantityElement.nativeElement.value =
      +this.currentQuantityElement.nativeElement.value + 1;

    const newQuantity = this.currentQuantityElement.nativeElement.value;
    this.cartItem.quantity = +newQuantity;

    this.updateQuantityCartLocal(this.cartItem.productId, newQuantity);

    if (this.isLogged()) {
      //sync to server
      this.cartItemPageService.updateItemInCart(this.cartItem).subscribe();
    }
  }

  onDecreaseQuantity() {
    let currentVal = this.currentQuantityElement.nativeElement.value;
    this.currentQuantityElement.nativeElement.value =
      +this.currentQuantityElement.nativeElement.value - 1;

    if (currentVal <= 1) {
      this.currentQuantityElement.nativeElement.value = 1;
    }

    const newQuantity = this.currentQuantityElement.nativeElement.value;
    this.cartItem.quantity = +newQuantity;

    this.updateQuantityCartLocal(this.cartItem.productId, newQuantity);

    if (this.isLogged()) {
      //sync to server
      this.cartItemPageService.updateItemInCart(this.cartItem).subscribe();
    }
  }

  onChangeCheckItem(event: Event) {
    const inputEL = event.target as HTMLInputElement;

    this.cartItem.isChecked = inputEL.checked;

    const product = this.listItemsLocal.find(
      (item) => item.productId === this.cartItem.productId
    );
    if (product) {
      const modifiedListCart = this.listItemsLocal.map((item) => {
        if (item.productId == this.cartItem.productId) {
          return { ...item, isChecked: inputEL.checked };
        }
        return item;
      });

      this.cartService.setListCartLocal(modifiedListCart);
    }

    if (this.isLogged()) {
      //sync to server
      this.cartItemPageService
        .updateItemInCart(this.cartItem)
        .subscribe((data) =>
          this.cartService.listCartUserPageSubject$.next(data)
        );
    }
  }

  onChangeQuantity(event: Event) {
    const inputEL = event.target as HTMLInputElement;

    if (!isNaN(+inputEL.value)) {
      this.cartItem.quantity = +inputEL.value;

      if (this.isLogged()) {
        //sync to server
        this.cartItemPageService
          .updateItemInCart(this.cartItem)
          .subscribe((data) =>
            this.cartService.listCartUserPageSubject$.next(data)
          );
      }
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
    }
  }

  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn muốn xóa khỏi giỏ hàng không?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-question-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
        });
      },
    });
  }

  updateQuantityCartLocal(productId: number, newQuantity: number){
    const product = this.listItemsLocal.find(
      (item) => item.productId === productId
    );
    if (product) {
      const modifiedListCart = this.listItemsLocal.map((item) => {
        if (item.productId == productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      this.cartService.setListCartLocal(modifiedListCart);
    }
  }
}
