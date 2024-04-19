import { Injectable } from '@angular/core';
import { CanMatch, CanActivate, ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class PublicGuard implements CanMatch, CanActivate{


  constructor( private authService: AuthService,
    private router: Router
  ) { }


private checkAuthStatus(): boolean | Observable<boolean> {

  return this.authService.checkAuthentication()
      .pipe (
      tap(isAuthenticated => console.log('Authenticated:', isAuthenticated)),
      //Si está autenticado, no quiero que pueda acceder al login, quiero que vuelva al listado de heroes
      tap( isAuthenticated => {
        if ( isAuthenticated) {
          this.router.navigate(['./'])
        }
      }),
      //Si NO está autenticado, lo tengo que dejar pasar!!! (si no hago esto, va a dar 44 al login aunque no etes autenticado)
      //Le cambio el valor para decir que no esté autenticado y el otro guard no lo pare
      map( isAuthenticated => !isAuthenticated),
    )

}


//canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
  console.log('Se puede match PublicGuard')
  console.log({route,segments})
  return this.checkAuthStatus();
}
  //canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
  console.log('Se puede activate PublicGuard')
  console.log({route,state})
  return this.checkAuthStatus();
}

}
