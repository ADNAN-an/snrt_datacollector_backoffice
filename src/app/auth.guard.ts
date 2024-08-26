import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      return true;  // Token exists, user is logged in
    } else {
      // No token, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}