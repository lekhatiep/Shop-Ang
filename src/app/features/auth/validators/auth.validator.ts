import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { map, Observable, of } from 'rxjs';

export class AuthValidator {
  static asyncEmailUnique(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      {
        return authService
          .checkEmailExist(control.value)
          .pipe(map((res: boolean) => (res ? { exists: true } : of(null))));
      }
    };
  }

  static confirmPasswordValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (confirmPassword === password) return null;

    return { passwordNotEqual: true };
  }

}
