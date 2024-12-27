import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RegisterModel } from '../models/register.model';
import { AuthValidator } from '../validators/auth.validator';
import { lastValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  @Output() activeLogin = new EventEmitter<boolean>(false);
  @Output() closeDialog = new EventEmitter<boolean>(false);

  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  existMail = false;

  formRegistration = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.required,
        //this.checkEmailUnique(this.authService),
      ],
      //asyncValidators: [this.checkEmailUnique(this.authService)]
    }),
    passwordGroup: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(3)],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required, Validators.minLength(3)],
        }),
      },
      {
        validators: [AuthValidator.confirmPasswordValidator],
      }
    ),
  });

  get passwordGroupInvalid() {
    return (
      this.formRegistration.controls.passwordGroup.touched &&
      this.formRegistration.controls.passwordGroup.dirty &&
      this.formRegistration.controls.passwordGroup.invalid
    );
  }

  get passwordsInvalid() {
    return (
      this.formRegistration.controls.passwordGroup.controls.password.touched &&
      this.formRegistration.controls.passwordGroup.controls.password.dirty &&
      this.formRegistration.controls.passwordGroup.controls.password.invalid &&
      this.formRegistration.controls.passwordGroup.controls.confirmPassword
        .touched &&
      this.formRegistration.controls.passwordGroup.controls.confirmPassword
        .dirty &&
      this.formRegistration.controls.passwordGroup.controls.confirmPassword
        .invalid
    );
  }

  onSubmit() {
    if (this.formRegistration.valid) {
      const dataRegister: RegisterModel = {
        email: this.formRegistration.controls.email.value ?? '',
        password:
          this.formRegistration.controls.passwordGroup.controls.password
            .value ?? '',
      };
      const subRegister = this.authService.register(dataRegister).subscribe({
        complete: () => this.closeDialog.emit(true),
      });

      this.destroyRef.onDestroy(() => {
        subRegister.unsubscribe();
      });
    }
  }

  async checkEmailUnique(email: string) {
    const checkMail$ = this.authService.checkEmailExist(email);
    this.existMail = await lastValueFrom(checkMail$);
  }

  async onFocusOutEmail() {
    if (
      this.formRegistration.controls.email.dirty &&
      this.formRegistration.controls.email.valid &&
      this.formRegistration.controls.email.touched
    ) {
      console.log('focusout');
      const enteredEmail = this.formRegistration.controls.email.value ?? '';
      const checkMail$ = this.authService.checkEmailExist(enteredEmail);
      this.existMail = await lastValueFrom(checkMail$);

      if (this.existMail) {
        this.formRegistration.controls.email.setErrors({ existMail: true });
      }
    }
  }

  onActiveLogin() {
    this.activeLogin.emit(true);
  }
}
