import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'heroes-hero-card',
  templateUrl: './card.component.html',
  styles: ``
})
export class CardComponent implements OnInit {



  //Tengo que ASEGURARME de que debo recibir un hero (para el compoente card-hero de este modulo)
  //Para eso me tengo que crear un Input porque lo recibe del compoenente padre list-page
  //Puede ser que venga oa que no, por eso ponemos !
  // También vamos a poner una validacion por si viene vacio, eso lo ponemos en el Oninit
  @Input()
  public hero!: Hero;


  ngOnInit(): void {
    if ( !this.hero ) throw Error('propiedad Hero es requerida')
  }

}
