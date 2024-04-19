import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) { }


  get currentUser():User|undefined {
    if ( !this.user ) return undefined;
    //El structuredClone es la soluion de javascript para crear una copia del objeto, para que asi aunque se pase por referencia,
    // se pasa un clon, por l oque no puedne manipular el objeto real del usuario, que es lo que queremos
    return structuredClone(this.user);
  }


  login ( email: string, password: string ):Observable<User> {

    //http.post('login',{email, password});    Estosería en un mundo real, de momento no podemos hacerlo asi
    //de momento nos conformamos con logarnos con el unico usuario que existe en el backend, el 1
    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap( user => this.user = user),
      tap( user => localStorage.setItem ('token', 'tokenInventado123456.1234'))
    )

  }

  checkAuthentication(): Observable<boolean> {

    if ( !localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    //return of(true);

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
    .pipe(
      tap( user => this.user = user ),
      //Doble negacion - Esto sirve para asegurarse un valor booleano para cuando user tenga valor
      map( user => !!user ),
      catchError( err => of(false) )
    )
  }

  logout () {
    this.user = undefined;
    localStorage.clear();
  }

}
