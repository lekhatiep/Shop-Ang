// number-check.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NumberCheckGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const id = route.paramMap.get('productID');

    if (!id || isNaN(Number(id))) {
      this.router.navigate(['/page-not-found']);
      return false;
    }

    return true;
  }
}
