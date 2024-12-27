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
  listItems = signal<any[]>([]);
  isLogged = false;

  ngOnInit(): void {
    this.cartService.isMyCartPage.set(true);

    this.authService.user$.subscribe((user) => {
      this.isLogged = !user ? false : true;
      if(user){
        this.loadListCart();
      }
    });

    this.cartService.listCartSubject$.subscribe((dataUpdate)=> {
      this.listItems.set(dataUpdate);      
    });
    
    //Not login: load from local
    if(!this.isLogged){
      this.listItems.set(this.cartService.getListCartLocal());
      console.log(this.listItems());
      
    }

    //  //Sub change in update item
    //  this.cartService.listCartUserPageSubject$.subscribe({
    //   next: (data) => {
    //     this.listItems.set(data);
    //   },
    // })
  }

  loadListCart(){
    this.cartService.syncListCartItemToServer().subscribe({
        next: (data)=> {
          this.listItems.set(data);
          this.cartService.setListCartLocal(data);
        }
      })
  }


  get totalPrice(){
    return this.listItems().filter(x=> x.isChecked).reduce((total, item)=>{
      return total + item.price * item.quantity
    }, 0)
  }

  get totalQuantity(){
    return this.listItems().filter(x=> x.isChecked).reduce((total, item)=>{
      return total + item.quantity
    }, 0)
  }
}


