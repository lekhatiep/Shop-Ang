import { Component, Input } from '@angular/core';
import { AdminSidebarItemModel } from '../models/admin-side-item.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar-item',
  standalone: true,
  templateUrl: './admin-sidebar-item.component.html',
  styleUrl: './admin-sidebar-item.component.css',
  imports: [RouterLink],
})
export class AdminSidebarItemComponent {
  @Input({required: true}) item!: AdminSidebarItemModel
}
