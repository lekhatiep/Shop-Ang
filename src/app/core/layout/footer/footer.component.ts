import { Component } from '@angular/core';

import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
//Icon style solid
import {faCopyright} from '@fortawesome/free-solid-svg-icons';
//Icon style regular
//import { faBell, faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
//Icon style brand
import {
  faFacebook,
  faInstagram,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  styleUrl: './footer.component.css',
  templateUrl: './footer.component.html',
  imports: [FontAwesomeModule],
})
export class FooterComponent {

  constructor(library: FaIconLibrary) {
    library.addIcons(
        faFacebook,
        faInstagram,
        faLinkedin,
        faCopyright
    );
    console.log(library);
  }
}
