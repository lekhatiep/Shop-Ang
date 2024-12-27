import {
  Component,
  ComponentRef,
  EventEmitter,
  inject,
  Output,
  signal,
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

import { Subscription } from 'rxjs';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';

import { ModalService } from '../../../shared/modal/modal.service';
import { AuthService } from '../../../features/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';

import { SearchInputComponent } from './search-input/search-input.component';
import { LoginComponent } from '../../../features/auth/login/login.component';
import { HeaderCartListComponent } from './header-cart-list/header-cart-list.component';
import { AuthWrapComponent } from "../../../features/auth/auth-wrap/auth-wrap.component";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [
    FontAwesomeModule,
    SearchInputComponent,
    SearchInputComponent,
    HeaderCartListComponent,
    OverlayPanelModule,
    DialogModule,
    AuthWrapComponent
],
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
  private cartService = inject(CartService);
  private router = inject(Router);

  countItem = signal<number>(0);
  visibleLoginDialog = false;
  isMyCartPage = this.cartService.isMyCartPage;

  constructor(library: FaIconLibrary) {
    library.addIcons(
      faMagnifyingGlass,
      faBell,
      faShoppingCart,
      faCircleQuestion,
      faGooglePay,
      faAppStore
    );
  }

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe((user) => {
      this.isAuthenticated = !user ? false : true;   
    });

    this.cartService.listCartSubject$.subscribe((data) =>
      this.countItem.set(data.length)
    );
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

  logOut() {
    this.authService.logout();
  }

  goMyCartPage(){
    this.router.navigate(['/cart']) 
  }

  showDialogLogin(){
    this.visibleLoginDialog = true;
  }

  onCloseAuthDialog(isClose : boolean){  
    if(isClose){
      this.visibleLoginDialog = false;
    }
  }
}
