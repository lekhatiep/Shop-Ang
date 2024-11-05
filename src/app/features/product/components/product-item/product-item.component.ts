import { Component, Input } from '@angular/core';
import { ProductModel } from '../../model/product.model';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {
   @Input({required: true}) product: ProductModel | null = null;

   imageURL = '';

   constructor(){
    //this.imageURL = this.product?.productImages[0]?.imagePath;
    console.log(this.product?.productImages);
    
   }
}
