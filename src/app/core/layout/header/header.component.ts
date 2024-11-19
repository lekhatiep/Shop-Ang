import {
  Component,
  ComponentRef,
  EventEmitter,
  inject,
  Output,
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
import { AuthService } from '../../../features/auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [FontAwesomeModule, SearchInputComponent, SearchInputComponent],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Output() searchText = new EventEmitter<string>();
  isAuthenticated = false;
  modalContainerRef!: ViewContainerRef;
  private loginComponentRef: ComponentRef<LoginComponent> | null = null;
  private userSub!: Subscription;

  vcr = inject(ViewContainerRef);
  private modalService = inject(ModalService);
  private authService = inject(AuthService);

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

    this.userSub = this.authService.user$.subscribe(user => {
      this.isAuthenticated = !user ? false : true;
    })
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

  logOut(){
    this.authService.logout();
  }
}
