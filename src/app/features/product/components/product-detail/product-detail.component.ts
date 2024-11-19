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

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [DecimalPipe, FontAwesomeModule, ReactiveFormsModule, ToastModule, ButtonModule, RippleModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
  providers: [MessageService]
})
export class ProductDetailComponent implements OnInit {
 
  error = signal('');
  isFetching = signal(false);
  private productService = inject(ProductService);
  private routerActivated = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);
  private cookieService = inject(CookieService);

  product = this.productService.product;
  id: string = '';
  currentQuantity: number = 1;

  listCartItem : {}[]  = [];

  get quantity() {
    return this.product()?.quantity ?? 1;
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
    const listCartData = JSON.parse(this.cookieService.getCookie("listCart") ?? '');
      if(listCartData){
        this.listCartItem =  JSON.parse(listCartData);
      }
      
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
      let listCartUpdate: any = [];

      if(this.listCartItem == null){
        
      }
      //const listCartData = JSON.parse(this.cookieService.getCookie("listCart") ?? '');
      if(this.listCartItem.length > 0){
         this.listCartItem?.map((item: any)=> {

          if(item.productID == this.id){
            item.quantity+= this.currentQuantity;
          }
          return item;
        })
        
      }else{
        
         this.listCartItem.push({
          productID: this.id,
          quantity: this.currentQuantity,
          price: this.product()?.price,
          userId: 0
        })
      }

      this.cookieService.setCookie("listCart", JSON.stringify(listCartUpdate), 10);
      console.log('addToCart');
      this.showToast1()
    }
  }

  showToast1() {
    this.messageService.clear();
    this.messageService.add({ key: 'toast1', severity: 'success', summary: 'Success', detail: 'Đã thêm vào giỏ' });
}
}
