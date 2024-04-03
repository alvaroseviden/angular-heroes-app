import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  //FORMULARIO REACTIVO
  public heroForm = new FormGroup( {
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', { nonNullable: true}),
    //Este es especial porque es de tipo Publisher
    //Se hace asi para no tener que asignarle un valor DC o MArvel por defecto
    publisher:        new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego:        new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters:       new FormControl<string>(''),
    alt_img:          new FormControl<string>(''),
  });

  public publishers = [
    //Los ids tienen que coincidir con los ids que devuelve el ws de json server
    { id:'DC Comics', desc: 'DC - Comics' },
    { id:'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor (
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog) {}



  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;

    console.log(hero);

    return hero;

  }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    if ( !this.router.url.includes('edit')) return;

    //si llegamos aqui, es que tenemos edit, estamos modificando un hero. Hay que cargar su data

    this.activatedRoute.params
    .pipe(
      // con desestructuracion, cogemos el id y llamamos al service para coger los datos del heroe por id
      // el service retorna un observable de tipo Hero, y lo mapeamos
      switchMap(({ id }) => this.heroesService.getHeroById(id) ),
    ).subscribe (hero => {
        // el hero este de params es el que hemos obtenido con el service en el switchMap

        //Si el heroe no existe lo sacamos a la pantalla de inicio
        if ( !hero ) return this.router.navigateByUrl('/');

        // Si existe, viene la parte magica
        //Para pasarlo al formulario:
        //Se podria pasar cada valor manualmente con este comando:
        //this.heroForm.setValue()
        //Pero es un dolor de cabeza
        this.heroForm.reset( hero );
        //1. Regresa el formulario a su valor original
        //2. Si recibe una rgumento estabcele automaticamente cada uno de los campos con los datos qe se les pase en el argumento
        // que sus nombres coincidan. En nuestor caso van a coincidir todos :)


        return;

    });


  }

  onSubmit():void {
    console.log ( {
      formIsValid: this.heroForm.valid,
      //value: this.heroForm.getRawValue() --> con esto tienes acceso a todos los campos del formulario, hasta los inahibiltados
      value: this.heroForm.value,
    })

    if ( this.heroForm.invalid ) return;

    //Esot sería lo logico, pero no funciona, porque el metodo espera un hero, y l oque le enviamos parece un hero, pero NO lo es
    //this.heroesService.updateHero(this.heroForm.value);
    // la solución es hacerlo con getters

    //Si el ID existe, lo que hacemos es updatear
    if ( this.currentHero.id ) {
      //Recordad que lo que devuelve siempre un service es un Observable que NO se dispara hasta que no te suscribas!!!
      this.heroesService.updateHero(this.currentHero)
      //tenemos el hero actulizado
      .subscribe( hero => {
        //snackbar
        this.showSnackbar(`${ hero.superhero } updated!`);
      });

      return;

    }
    //Si no existe el id, llega a qui, y l oqu tenemos que hacer es CREAR un hero
    this.heroesService.addHero( this.currentHero )
    .subscribe( hero => {
      //Mostrar snackbar,  y navegar a heros/edit/hero.id
      this.router.navigate(['/heroes/edit', hero.id]);
      this.showSnackbar(`${ hero.superhero } created!`);
    });
  }

  //Esto funciona, pro lo de tener un subscrbe dentro de otro no es facil de leer
  /*onDeleteHero () {
    //No necesito pasarle argumentos proque ya tengo el heroe en e l formulario y get currentHero
    if (!this.currentHero.id ) throw Error ('Hero Id es requerido');

    const dialogRef = this.dialog.open (ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed().subscribe ( result => {
      console.log('El dialog se ha cerrado');
      console.log({ result });
      //Si ha dado error no hago nada
      if ( !result ) return;
      //Si llega aqui, eliminamos al heroe
      this.heroesService.deleteHeroById( this.currentHero.id )
      .subscribe( wasDeleted => {
        //Devuelve true o false. True si lo ha eliminado ok
        if ( wasDeleted ) {
          //Si llega aqui es que lo ha borrado ok
          console.log('Heroe Borrado');
          //Navegamos
          this.router.navigate(['/heroes']);
        }
      });

    })
  }*/

    // Mejor lo hacemos asi
  onDeleteHero () {
    //No necesito pasarle argumentos proque ya tengo el heroe en e l formulario y get currentHero
    if (!this.currentHero.id ) throw Error ('Hero Id es requerido');

    const dialogRef = this.dialog.open (ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
    .pipe(
      tap ( result => console.log(result)),
      //filtramos para dejar pasar solo cuando sea tue. es decir, pasamos cuando en el dialog ha dicho que si quiere borrar
      //filter( result => result === true),
      filter( (result:boolean) => result ),
      switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id)),
      tap ( wasDeleted => console.log({wasDeleted})),
      filter( (wasDeleted:boolean) => wasDeleted ),
    )
    .subscribe ( result => {

      //Con los puesto en el pipe, solo va a ajecutar el subscribe si aceptó  eliminar, y fue eliminao ok
      // si no, no se lanza porque los filtros lo paraban antes
      console.log('El dialog se ha cerrado');
      console.log({ result });

      //Navegamos al inicio del listado cuando hemos borrado ok
      this.router.navigate(['/heroes']);

    })
  }


  showSnackbar ( message: string ): void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    } )
  }

}
