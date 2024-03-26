import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { HeroPageComponent } from './pages/hero-page/hero-page.component';


//localhost:4200/heroes/
const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    //Esto es lo mismo que loadChildren pero sin lazyload
    //Lo hacemos aqui sin lazy porque ya el modulo se está cargando con lazy load
    //Se podría hacer, pero ya sería util si elmodulo fuera muy muy grande y fuera bueno cargarlo a cachos
    children: [
      {
        path: 'new-hero', component: NewPageComponent
      },
      {
        path: 'search', component: SearchPageComponent
      },
      {
        path: 'edit/:id', component: NewPageComponent
      },
      {
        path: 'list', component: ListPageComponent
      },
      //Esta se pone al final, porque si no estra por aqui simpre
      // Esa la vamos a usar para accer para validar
      {
        path: ':id', component: HeroPageComponent
      },
      // A esta solo va a acceder por primera vez
      {
        path: '**', redirectTo: 'list'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeroesRoutingModule { }
