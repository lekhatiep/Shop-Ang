import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';

import { CartItemModel } from '../../../../features/cart/models/cart-item.model';
import { CartItemComponent } from '../../../../features/cart/components/cart-item/cart-item.component';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { CartService } from '../../../../features/cart/services/cart.service';
import { AuthWrapComponent } from "../../../../features/auth/auth-wrap/auth-wrap.component";


@Component({
  selector: 'app-header-cart-list',
  standalone: true,
  imports: [CartItemComponent],
  templateUrl: './header-cart-list.component.html',
  styleUrl: './header-cart-list.component.css',
})
export class HeaderCartListComponent implements OnInit {
  @Output() goMyCartPage = new EventEmitter<boolean>(false);

  private authService = inject(AuthService);
  private cartService = inject(CartService);

  isLogged = false;
  listCarts: CartItemModel[] = [];
  currentUserID = 0;
  visibleLoginDialog = false;

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.isLogged = !user ? false : true;
      if(user){
        this.loadListCart();
      }
    });

    this.cartService.listCartSubject$.subscribe((dataUpdate)=> {
      this.listCarts = dataUpdate;      
    });
    
    //Not login: load from local
    if(!this.isLogged){
      this.listCarts = this.cartService.getListCartLocal();
    }
  }

  loadListCart(){
    this.cartService.syncListCartItemToServer().subscribe({
        next: (data)=> {
          this.listCarts = data;
          this.cartService.setListCartLocal(data);
        }
      })
  }

  onGoMyCartPage(){
    this.goMyCartPage.emit(true);
  }
  
}
