import { Component, ViewEncapsulation } from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import {
  faBell,
  faCircleQuestion
} from '@fortawesome/free-regular-svg-icons';
import { faGooglePay, faAppStore } from '@fortawesome/free-brands-svg-icons';
import { SearchInputComponent } from "./search-input/search-input.component";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [FontAwesomeModule, SearchInputComponent, SearchInputComponent],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {

  constructor(library: FaIconLibrary) {
    library.addIcons(
      faMagnifyingGlass,
      faBell,
      faShoppingCart,
      faCircleQuestion,
      faGooglePay,
      faAppStore
    );
    console.log(library);
    
  }
}
