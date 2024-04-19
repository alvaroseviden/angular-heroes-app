import { Component, OnInit } from '@angular/core';
//import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'heroesApp';



/*NOTA:
Porejemplo, si pongo en el app component que verique a lrecargar pagina si ya hay sesion abierta, l otengo que poner en el oninit
y si lo pongo en el oniti, ya se va a cargar info de la pagina que no quiero que se carge si no hay sesion o no es valida.
PAra hacer esto, uso los guards
Por eso, esto no lo puedo hacer aqui
/*

  //Pongo aqui o del auth porque todo pas por el app component
  //constructor ( private authService: AuthService)  {}



  /*ngOnInit(): void {
    //Cada vez que reinicio la aplicación, vigilo si ya hay un token en localstorage para mantener la sesion
    //Y tengo que poner subscribe pq es un observable
    this.authService.checkAuthentication().subscribe( () => {
      console.log('checkAuthentication acabado');
    });
  }*/


}
