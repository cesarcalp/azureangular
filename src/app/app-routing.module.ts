import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonaJuridicaComponent } from './register/persona-juridica/persona-juridica.component';
import { PersonaNaturalComponent } from './register/persona-natural/persona-natural.component';
import { SelectorComponent } from './register/selector/selector.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { path: 'registration', component: RegistrationComponent },
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
