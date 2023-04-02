import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    const authority = route.data['authority'];
    
    if (this.userService.isLoggedIn()) {
        this.userService.redirectTo = url;
        this.router.navigate(['/']);
        return false;
    }

    if (this.userService.hasAuthority(authority)) {
        return true;
    } 
    else {
        this.router.navigate(['/forbidden']);
        return false;
    }
  }
}
