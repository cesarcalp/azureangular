import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaNaturalComponent } from './persona-natural/persona-natural.component';
import { PersonaJuridicaComponent } from './persona-juridica/persona-juridica.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SelectorComponent } from './selector/selector.component';


@NgModule({
  declarations: [
    PersonaNaturalComponent,
    PersonaJuridicaComponent,
    SelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    HttpClientModule
  ]
})
export class RegisterModule { }
