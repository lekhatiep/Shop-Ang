import {
  Component,
  ComponentRef,
  inject,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { faBell, faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { faGooglePay, faAppStore } from '@fortawesome/free-brands-svg-icons';
import { SearchInputComponent } from './search-input/search-input.component';


import { ModalService } from '../../../shared/modal/modal.service';
import { LoginComponent } from '../../../features/auth/login/login.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [FontAwesomeModule, SearchInputComponent, SearchInputComponent],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  modalContainerRef!: ViewContainerRef;
  private loginComponentRef: ComponentRef<LoginComponent> | null = null;

  vcr = inject(ViewContainerRef);
  private modalService = inject(ModalService);

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

  ngOnInit() {
    // Truyền ViewContainerRef vào service
    // this.modalService.setViewContainerRef(this.modalContainerRef);
  }

  openModalLogin() {
    console.log('openModalLogin');
    this.modalService.setViewContainerRef(this.vcr);
    this.modalService.openModal(
      LoginComponent,
      {
        isModal: true,
        someData: 'Dữ liệu động',
        useDefaultButtonModal: false,
      },
      30
    );
  }
}
