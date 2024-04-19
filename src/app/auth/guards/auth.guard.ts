import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, UrlSegment, GuardResult, MaybeAsync, RouterStateSnapshot, Router} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate{


  constructor( private authService: AuthService,
              private router: Router
  ) { }


  private checkAuthStatus(): boolean | Observable<boolean> {

    return this.authService.checkAuthentication()
    .pipe (
      tap(isAuthenticated => console.log('Authenticated:', isAuthenticated)),
      //Si no está autenticado, no quiero que vaya al 404, quiero que vuelva al login
      tap( isAuthenticated => {
        if ( !isAuthenticated) {
          this.router.navigate(['./auth/login'])
        }
      }),

    )

  }


  //canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    console.log('Se puede match')
    console.log({route,segments})
    return this.checkAuthStatus();
  }
  //canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    console.log('Se puede activate')
    console.log({route,state})
    return this.checkAuthStatus();
  }


}
