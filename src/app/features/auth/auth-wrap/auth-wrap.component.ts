import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { LoginComponent } from "../login/login.component";
import { SignupComponent } from "../signup/signup.component";

@Component({
  selector: 'app-auth-wrap',
  standalone: true,
  imports: [LoginComponent, SignupComponent],
  templateUrl: './auth-wrap.component.html',
  styleUrl: './auth-wrap.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AuthWrapComponent {
  @Output() closeDialog = new EventEmitter<boolean>(false)
  activeLogin = true;
  activeSignup = false;

  onActiveSignup(){
    this.activeSignup = true;
    this.activeLogin = false;
  }

  onActiveLogin(){
    this.activeLogin = true;
    this.activeSignup = false;
  }

  onCloseDialog(isClose: boolean){
    this.closeDialog.emit(isClose)
  }
}
