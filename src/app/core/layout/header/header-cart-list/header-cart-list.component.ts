import { Component, inject, OnInit } from '@angular/core';
import { CartItemModel } from '../../../../features/cart/models/cart-item.model';
import { CartItemComponent } from '../../../../features/cart/components/cart-item/cart-item.component';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { CartService } from '../../../../features/cart/services/cart.service';

@Component({
  selector: 'app-header-cart-list',
  standalone: true,
  imports: [CartItemComponent],
  templateUrl: './header-cart-list.component.html',
  styleUrl: './header-cart-list.component.css',
})
export class HeaderCartListComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  isLogged = false;
  listCarts: CartItemModel[] = [];
  currentUserID = 0;

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

    console.log(this.listCarts.length > 0);
    
  }

  loadListCart(){
    const listCartLocal = this.cartService.getListCartLocal();

    // this.cartService.getListCart().subscribe({
    //   next: (data)=> {
    //     this.listCarts = this.cartService.syncListCart(listCartLocal, data)
    //   }
    // })

    this.cartService.syncListCartItemToServer().subscribe({
        next: (data)=> {
          this.listCarts = data;
        }
      })
  }

  
}
