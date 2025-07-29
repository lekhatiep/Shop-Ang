import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AdminSidebarItemModel } from './models/admin-side-item.model';
import { AdminSideBarService } from './services/admin-sidebar.service';
import {
  faCaretRight,
  faCaretDown,
  faAnglesRight,
  faAnglesDown
} from '@fortawesome/free-solid-svg-icons';

import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
  imports: [RouterLink, FontAwesomeModule,RouterModule],
  encapsulation: ViewEncapsulation.None,
})
export class AdminSidebarComponent {
  private adminSidebarService = inject(AdminSideBarService);
  menuItems = this.adminSidebarService.dataSidebarItem

   constructor(private libIcon: FaIconLibrary) {
    libIcon.addIcons(faCaretRight, faCaretDown, faAnglesRight, faAnglesDown);
    //console.log(libIcon);
    
  }

  toggle(item: AdminSidebarItemModel){
    item.expanded = !item.expanded
  }
}
