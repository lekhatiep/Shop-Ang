import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductModel } from '../../model/product.model';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [RouterLink, DecimalPipe,CurrencyPipe],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css',
})
export class ProductItemComponent {
  @Input({ required: true }) product: ProductModel | null = null;
  @Output() selectProductID = new EventEmitter<number>();

  get ImagePath() {
    return this.product?.productImages?.at(0)?.imagePath ?? '';
  }

  selectProduct(productID : number | undefined){
    if(productID){
      this.selectProductID.emit(productID)

    }
  }
}
