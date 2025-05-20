import { Injectable, inject } from '@angular/core';
import { TokenService } from '../servicios/token.service';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  constructor(private tokenService: TokenService, private router: Router) { }


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log("ingresó a canActive")  ;
    if (this.tokenService.isLogged()) {
      this.router.navigate([""]);
      return false;
      }
      return true;
  }

}
export const LoginGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state:
  RouterStateSnapshot): boolean => {
  return inject(PermisoService).canActivate(next, state);
}


