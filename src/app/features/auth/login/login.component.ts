import { Component, DestroyRef, inject, Input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ModalService } from '../../../shared/modal/modal.service';
import { debounceTime, of } from 'rxjs';

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
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [Validators.required],
      asyncValidators: [emailIsUnique],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        mustContainQuestionMark,
      ],
    }),
  });

  private modalService = inject(ModalService);

  back() {
    console.log('back');

    if (this.isModal) {
      this.modalService.closeModal();
    }
  }

  onSubmit() {
    console.log(this.form);
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;

    console.log(enteredEmail, enteredPassword);
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
    // const savedForm = localStorage.getItem('saved-login-form');
    // if (savedForm) {
    //   const loadedForm = JSON.parse(savedForm);
    //   this.form.patchValue({ email: loadedForm.email });
    // }

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
}
