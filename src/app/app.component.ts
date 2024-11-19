import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UserLayoutComponent } from './core/layout/user-layout/user-layout.component';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    UserLayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  
  ngOnInit(): void {
    this.authService.autoLogin();
  }
  title = 'shop-ang';
}
