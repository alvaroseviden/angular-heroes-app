import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { PublicGuard } from './auth/guards/public.guard';

//localhost:4200/
const routes: Routes = [
  {
    path: 'auth',
    //Lo cargo con lazyload, por eso uso loadchildren
    loadChildren: () => import('./auth/auth.module').then ( m => m.AuthModule),
    canActivate: [ PublicGuard ],
    canMatch: [ PublicGuard ]
  },
  {
    path: 'heroes',
    //Lo cargo con lazyload, por eso uso loadchildren
    loadChildren: () => import('./heroes/heroes.module').then ( m => m.HeroesModule),
    canActivate: [ AuthGuard ],
    canMatch: [ AuthGuard ]
  },
  {
    path: '404',
    //ESTE NO ES LAzyLoad, se carga siempre
    component: Error404PageComponent,
  },
  {
    path: '',
    //A la primera vez que se accede, redireccionamos a la pagina inicial por defecto
    redirectTo: 'heroes',
    //Esto se pone para que coincida exactamente el string vacio. Si no se pone,
    // todas las rutas defiinas antes tambien contienne el vacio
    //Por lo que cualquier ruta iria a esta, a la de vacio
    pathMatch: 'full',
  },
  {
    path: '**',
    //Cuando sea una ruta no contemplada, va a la pagina de 4040
    redirectTo: '404',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
