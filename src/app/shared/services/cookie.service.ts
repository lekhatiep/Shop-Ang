import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  setCookie(cname: any, data: any, expiredDay: number) {
    const d = new Date();
    d.setTime(d.getTime() + expiredDay * 24 * 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + data + ';' + expires + ';path=/';
  }

  getCookie(cname: any) {
    let ca = document.cookie.split(';');
    let name = cname + '=';

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }

    return null;
  }

  deleteCookie(cname: any) {
    document.cookie =
      cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}
