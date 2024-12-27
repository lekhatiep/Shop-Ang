import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ModalService } from '../../../shared/modal/modal.service';
import { debounceTime, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return { doesNotContainQuestionMark: true };
}

function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'adm') {
    return of(null);
  }
  return of({ notUnique: false });
}

let initialEmailValue = '';
const savedForm = localStorage.getItem('saved-login-form');
if (savedForm) {
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-login',
  standalone: true,
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  @Input() isModal: boolean = false;

  @Output() activeSignup = new EventEmitter<boolean>(false);
  @Output() closeDialog = new EventEmitter<boolean>(false);
  
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [Validators.required],
      asyncValidators: [emailIsUnique],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
       // mustContainQuestionMark,
      ],
    }),
  });

  private modalService = inject(ModalService);

  back() {
    if (this.isModal) {
      this.modalService.closeModal();
    }
  }

  onSubmit() {
    const enteredEmail = this.form.value.email ?? '';
    const enteredPassword = this.form.value.password ?? '';

    const subLogin = this.authService
      .login(enteredEmail, enteredPassword)
      .subscribe({ complete: () => 
        this.closeDialog.emit(true) });

    this.destroyRef.onDestroy(() => {
      subLogin.unsubscribe();
    });
  }

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      //this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }
  ngOnInit() {
    const subscription = this.form.valueChanges
      .pipe(debounceTime(1000))
      .subscribe({
        next: (value) => {
          localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email })
          );
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onaActiveSignup() {
    this.activeSignup.emit(true);
  }
}
