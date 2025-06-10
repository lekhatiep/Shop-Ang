import { Component, inject } from '@angular/core';
import { AdminSideBarService } from '../admin-sidebar/services/admin-sidebar.service';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.css',
  imports: [],
})
export class AdminProductComponent {
  private adminSidebarService = inject(AdminSideBarService)
}
