import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navigation-paging',
  standalone: true,
  imports: [],
  templateUrl: './navigation-paging.component.html',
  styleUrl: './navigation-paging.component.css'
})
export class NavigationPagingComponent {
  @Input({required: true}) totalPage! : number;
  @Input({}) pageNumber! : number;

}
