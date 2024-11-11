import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../../../features/product/services/product.service';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css',
})
export class SearchInputComponent {
  @Output() searchText = new EventEmitter<string>();

  formSearch = new FormGroup({
    searchText: new FormControl('', {
      validators: Validators.required,
    }),
  });

  private productService = inject(ProductService);

  constructor(library: FaIconLibrary) {
    library.addIcons(faMagnifyingGlass);
  }

  onSubmit() {
    console.log(this.formSearch.controls.searchText.value);
    if (!this.formSearch.valid) return;

    var searchTextControl = this.formSearch.controls.searchText;
    if (searchTextControl.valid) {
      this.searchText.emit(searchTextControl.value ?? '');
      this.productService.loadAvailableProduct(1,searchTextControl.value ?? '');
    }
  }
}
