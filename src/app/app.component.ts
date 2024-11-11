import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { ContainerComponent } from './core/layout/container/container.component';
import { ModalComponent } from './shared/modal/modal.component';
import { LoginComponent } from './features/auth/login/login.component';
import { UserLayoutComponent } from './core/layout/user-layout/user-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ContainerComponent,
    ModalComponent,
    LoginComponent,
    UserLayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'shop-ang';
}
