import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) { }


  getHeroes(): Observable<Hero[]> {

      return this.http.get<Hero[]>(`${ this.baseUrl }/heroes`);
  }

  getHeroById ( id: string): Observable<Hero | undefined> {

      return this.http.get<Hero>(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        //El of de rxjs crea un observable basado en lo recibido entre parentesis
        // Basicamente es un Observable que retorna undefined
        catchError( error => of(undefined) )
      );
  }

  //Esto es como dice el profe, pero no funciona
  /*getSuggestions ( query: string ): Observable<Hero[]> {
    return this.http.get<Hero[]>(`/heroes?q=${ query }&_limit=6`);
  }*/

  //Esto es como l oresolvieron los alumnos
//Lo que hace es maepar a heroes filtrando los nombre de syperheroe por el query
  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?_limit=6`)
        .pipe(
            map(heroes => heroes.filter(hero => hero.superhero.toLowerCase().includes(query.toLowerCase())))
        );
  }



  //--------------CRUD ENDPOINTS -----------------------

  addHero( hero: Hero ): Observable<Hero> {
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero)
  }

  updateHero( hero: Hero ): Observable<Hero> {
    if (!hero.id) throw Error('El Hero id es requerido');
    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero)
  }

  deleteHeroById( id: string ): Observable<boolean> {

    return this.http.delete(`${this.baseUrl}/heroes/${id}`)
    .pipe(
      map( resp => true),
      catchError ( err => of (false) ),
    )
  }


}
