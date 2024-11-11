import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';

import {faCartShopping, faMinus, faPlus} from '@fortawesome/free-solid-svg-icons'
import { ProductService } from '../../services/product.service';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [DecimalPipe, FontAwesomeModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {

  error = signal('');
  isFetching = signal(false);
  private productService = inject(ProductService);
  private routerActivated = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  product = this.productService.product;
  id : string = '';

  constructor(private libIcon: FaIconLibrary){
    libIcon.addIcons(
      faCartShopping,
      faMinus,
      faPlus
    )
  }
  ngOnInit(): void {
    const subRout = this.routerActivated.paramMap.subscribe({
      next: (paramMap)=> {this.id =  paramMap.get('productID') ?? '',
        this.loadProductDetail();
      }
      
    })

    this.destroyRef.onDestroy(()=>{
      subRout.unsubscribe();
    })
  }

  loadProductDetail(){

    this.isFetching.set(true);
    const subloadProd =  this.productService.loadProductByID(+this.id).subscribe({
      error: (error)=> this.error.set(error.message),
      complete: ()=> this.isFetching.set(false)
    })

    this.destroyRef.onDestroy(()=> subloadProd.unsubscribe());
  }
}
