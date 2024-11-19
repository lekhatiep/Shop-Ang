import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, delay, tap, throwError } from 'rxjs';

import { API_URL } from '../../../core/constants/app.constants';
import { RegisterModel } from '../models/register.model';
import { LoginResponseModel } from '../models/login-response.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  private timerExpirationDuration: any;
  user$ = new BehaviorSubject<User | null>(null);

  checkEmailExist(email: string) {
    const url = 'https://localhost:5001/api/Users/CheckEmailExists';
    return this.httpClient
      .get<boolean>(url, {
        params: {
          email: email,
        },
      })
      .pipe(
        delay(1000),
        catchError(() => throwError(() => new Error('Failed')))
      );
  }

  

  login(email: string, password: string) {
    const url = 'https://localhost:5001/api/Users/login';
    return this.httpClient
      .post<LoginResponseModel>(url, {
        email,
        password,
      })
      .pipe(
        catchError(() => throwError(() => new Error('Login Failed'))),
        tap((resData) => {
          const expirationDate = new Date(
            new Date().getTime() + +resData.expired_in * 1000
          );
          const user = new User(email, resData.access_token, expirationDate);
          
          //this.autoLogout(+resData.expired_in * 1000)
          localStorage.setItem('userData', JSON.stringify(user));
          this.user$.next(user);
        })
      );
  }

  autoLogin() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      return;
    }

    const userDataLoad: {
      email: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(userData);

    const storeUser = new User(
      userDataLoad.email,
      userDataLoad._token,
      new Date(userDataLoad._tokenExpirationDate)
    );
    
    const expirationDuration = new  Date(storeUser._tokenExpirationDate).getTime() - new Date().getTime() 
    this.user$.next(storeUser);
    this.autoLogout(expirationDuration);
  }

  logout() {
    this.user$.next(null);
    this.router.navigate(['/']);

    localStorage.removeItem('userData');

    if (this.timerExpirationDuration) {
      clearTimeout(this.timerExpirationDuration);
    }

    this.timerExpirationDuration = null;
  }

  autoLogout(expirationDuration: number) {
    this.timerExpirationDuration = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  register(register: RegisterModel) {
    const url = 'https://localhost:5001/api/Users/register';
    return this.httpClient
      .post<RegisterModel>(url, register)
      .pipe(catchError(() => throwError(() => new Error('Register Failed'))));
  }
}