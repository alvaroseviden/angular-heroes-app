import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';



@NgModule({
  declarations: [
    Error404PageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    //Este sí lo exporto porque quiero que esta sea una ruta por defecto para el app_module
    Error404PageComponent
  ]
})
export class SharedModule { }
