import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { ContainerComponent } from "../container/container.component";

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet, ContainerComponent, RouterOutlet],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent {

}
