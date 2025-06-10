import { Injectable } from '@angular/core';
import { AdminSidebarItemModel } from '../models/admin-side-item.model';

@Injectable({
  providedIn: 'root',
})
export class AdminSideBarService {
  //   private listSidebarDefault: AdminSidebarItemModel[] = [
  //     {
  //       url: 'dashboard',
  //       name: 'Dashboard',
  //     },
  //     {
  //       url: 'product',
  //       name: 'Manage Product',
  //     },
  //   ];

  // admin-sidebar.component.ts
  menuItems: AdminSidebarItemModel[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: 'dashboard',
    },
    {
      label: 'Manage Product',
      icon: 'product',
      children: [
        { label: 'Product List', route: 'product' },
        { label: 'Order List', route: 'order' },
      ],
    },
    {
      label: 'Manage Users',
      icon: 'User',
      children: [
        { label: 'User List', route: '/admin/users' },
        { label: 'Create User', route: '/admin/users/create' },
      ],
    },
    {
      label: 'Settings',
      icon: 'settings',
      children: [
        { label: 'Profile', route: '/admin/settings/profile' },
        { label: 'Security', route: '/admin/settings/security' },
      ],
    },
  ];

  dataSidebarItem = this.menuItems;

  updateDataItem(data: AdminSidebarItemModel[]) {
    this.dataSidebarItem = data;
  }
}
