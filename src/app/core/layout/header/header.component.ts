import { Component } from '@angular/core';
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

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [FontAwesomeModule],
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
