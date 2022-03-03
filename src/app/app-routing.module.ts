import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PersonaJuridicaComponent } from './register/persona-juridica/persona-juridica.component';
import { PersonaNaturalComponent } from './register/persona-natural/persona-natural.component';
import { SelectorComponent } from './register/selector/selector.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'register',
    children: [
      { path: '', component: SelectorComponent },
      { path: 'natural', component: PersonaNaturalComponent },
      { path: 'juridica', component: PersonaJuridicaComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
