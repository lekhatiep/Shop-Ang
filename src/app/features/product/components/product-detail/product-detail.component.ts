import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';

import {
  faCartShopping,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../services/product.service';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CookieService } from '../../../../shared/services/cookie.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CartService } from '../../../cart/services/cart.service';
import { CartItemModel } from '../../../cart/models/cart-item.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    DecimalPipe,
    FontAwesomeModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    RippleModule,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
  providers: [MessageService],
})
export class ProductDetailComponent implements OnInit {
  error = signal('');
  isFetching = signal(false);
  private productService = inject(ProductService);
  private routerActivated = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  product = this.productService.product;
  id: string = '';
  currentQuantity: number = 1;
  listCartItem: CartItemModel[] = [];
  isLogin = false;

  get quantity() {
    return this.product()?.quantity ?? 1;
  }

  get listCartServer(){
    return this.cartService.listCart();
  }

  quantityGroup = new FormGroup({
    inputQuantity: new FormControl(1, {
      validators: [Validators.max(this.quantity)],
    }),
  });

  get quantityInValid() {
    return (
      this.quantityGroup.controls.inputQuantity.dirty &&
      this.quantityGroup.controls.inputQuantity.touched &&
      this.quantityGroup.controls.inputQuantity.invalid
    );
  }

  constructor(private libIcon: FaIconLibrary) {
    libIcon.addIcons(faCartShopping, faMinus, faPlus);
  }
  ngOnInit(): void {
    const subRout = this.routerActivated.paramMap.subscribe({
      next: (paramMap) => {
        (this.id = paramMap.get('productID') ?? ''), this.loadProductDetail();
      },
    });

    this.destroyRef.onDestroy(() => {
      subRout.unsubscribe();
    });

    //load list cart temp
    const listCartData = localStorage.getItem('listCart');
    if (listCartData) {
      this.listCartItem = JSON.parse(listCartData);
    }

    //obs user 

    const subUser = this.authService.user$.subscribe(user=>{
        this.isLogin = user ? true : false
    })

    this.destroyRef.onDestroy(()=> {
      subUser.unsubscribe();
    })
  }

  loadProductDetail() {
    this.isFetching.set(true);
    const subloadProd = this.productService
      .loadProductByID(+this.id)
      .subscribe({
        error: (error) => this.error.set(error.message),
        complete: () => this.isFetching.set(false),
      });

    this.destroyRef.onDestroy(() => subloadProd.unsubscribe());
  }

  increase() {
    console.log(this.currentQuantity, this.quantity);

    if (this.currentQuantity < this.quantity) {
      this.currentQuantity = ++this.currentQuantity;
    }
  }

  decrease() {
    if (this.currentQuantity > 0) {
      this.currentQuantity = --this.currentQuantity;
    }
  }

  addToCart() {
    if (this.quantityGroup.controls.inputQuantity.valid) {

      let newItem : CartItemModel = {
        productId: +this.id,
        imgPath: this.product()?.imagePath || '',
        quantity: this.currentQuantity,
        price: this.product()?.price || 0 ,
        userID: 0,
      }

      this.listCartItem = this.cartService.syncListCart(this.listCartItem, [newItem]);

      localStorage.setItem('listCart', JSON.stringify(this.listCartItem));
      console.log('addToCart');

      const syncCart = this.cartService.syncListCart(this.listCartItem, this.listCartServer)
      this.cartService.listCartSubject$.next(syncCart);
      this.showToast1();
    }
  }

  showToast1() {
    this.messageService.clear();
    this.messageService.add({
      key: 'toast1',
      severity: 'success',
      summary: 'Success',
      detail: 'Đã thêm vào giỏ',
    });
  }
}
