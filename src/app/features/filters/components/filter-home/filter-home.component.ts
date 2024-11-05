import { Component } from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-filter-home',
  standalone: true,
  templateUrl: './filter-home.component.html',
  styleUrl: './filter-home.component.css',
  imports: [FontAwesomeModule],
})
export class FilterHomeComponent {
  constructor(library: FaIconLibrary) {
    library.addIcons(faAngleLeft, faAngleRight);
  }
}
