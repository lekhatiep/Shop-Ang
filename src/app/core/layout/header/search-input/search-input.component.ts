import { Component, ViewEncapsulation } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css',

})
export class SearchInputComponent {
  constructor(library : FaIconLibrary){
    library.addIcons(faMagnifyingGlass) 
  }
}
