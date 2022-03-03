import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { finalize, Observable, Subscription } from 'rxjs';
import { matchValidator } from 'src/app/providers/CustomValidators';
import { PaisesInterface } from 'src/app/shared/models/paises-interface';
import { ParametrosInterface } from 'src/app/shared/models/parametros-interface';
import { PersonaJuridicaInterface } from 'src/app/shared/models/persona-juridica-interface';
import { DataApiClientService } from 'src/app/shared/services/data-api-client.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-persona-juridica',
  templateUrl: './persona-juridica.component.html',
  styleUrls: ['./persona-juridica.component.css']
})
export class PersonaJuridicaComponent implements OnInit {
  @ViewChild('ngForm')
  formDirective!: FormGroupDirective;
  
  submitted: boolean = false;
  guardando: boolean = false;
  nacionalidades: Array<PaisesInterface> = [];
  comoNosContacto: Array<ParametrosInterface> = [];
  private subscriptions: Array<Subscription> = [];
  guardar$: Observable<any> | undefined;

  registrationForm: FormGroup = new FormGroup({
    razonSocial: new FormControl(null, [
      Validators.required
    ]),
    ruc: new FormControl(null, [
      Validators.required
    ]),
    inicioActividad: new FormControl(null, [
      Validators.required
    ]),
    telefono: new FormControl(null, [
      Validators.required
    ]),
    nacionalidad: new FormControl(null, [
      Validators.required
    ]),
    nombreContacto: new FormControl(null, [
      Validators.required
    ]),
    cargoContacto: new FormControl(null, [
      Validators.required
    ]),
    correoElectronico: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),
    contrasenia: new FormControl(null, [
      Validators.required,
      //Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
      Validators.minLength(6),
      Validators.maxLength(12),
      matchValidator('confirmarContrasenia', true)
    ]),
    confirmarContrasenia: new FormControl(null, [
      Validators.required,
      matchValidator('contrasenia')
    ]),
    comoContactaste: new FormControl(null, [
      Validators.required
    ]),
    acuerdo: new FormControl(null, [
      Validators.required
    ]),      
  }
  );

  get db() { return this.registrationForm.controls }
  get contrasenia() { return this.registrationForm.get('contrasenia'); }
  get confirmarContrasenia() { return this.registrationForm.get('confirmarContrasenia'); }

  constructor(private formBuilder: FormBuilder,
    private dataApiClient: DataApiClientService,) { }

  ngOnInit(): void {
    this.getCatalogos();
  }

  onSubmit() {
    console.warn(this.registrationForm.value);
    this.submitted = true;
    
    if (!this.registrationForm.valid
    ) {
      return;
    }

    this.submitted = false;
    let cuenta = this.obtenerCuenta();
    this._crearCuenta(cuenta);    
  }

  IsInvalid(control: string): boolean {
    if (this.registrationForm.get(control) != null) {
      let controlForm = this.registrationForm.get(control);
      return controlForm != null 
            ? ((controlForm.invalid && (controlForm.dirty || controlForm.touched)) 
              || controlForm.invalid && this.submitted )
            : false;
    }
    return false;
  }

  getCatalogos(): void {
    
    this.dataApiClient.ConsultaPaises().subscribe(
      (data: Array<PaisesInterface>) => {
        this.nacionalidades = data;
      });

      this.dataApiClient.ConsultaItems("ComoNosContacto").subscribe(
        (data: Array<ParametrosInterface>) => {
          this.comoNosContacto = data;
        });
  }

  obtenerCuenta(): PersonaJuridicaInterface{
    let cuenta: PersonaJuridicaInterface;
    
    cuenta = {
      tipoCliente: 'INVERSIONISTA',
      tipoPersona: 'JUR',
      tipoIdentificacion: 'RUC',
      razonSocial: this.db['razonSocial'].value,
      identificacion: this.db['ruc'].value,
      nombreContacto: this.db['nombreContacto'].value,
      cargoContacto: this.db['cargoContacto'].value,
      anioInicioActividad: this.db['inicioActividad'].value,
      email: this.db['correoElectronico'].value,
      numeroCelular: this.db['telefono'].value,
      nacionalidad: this.db['nacionalidad'].value,
      clave: this.db['contrasenia'].value,
      tipoContacto: 'PUB',
      aceptaPoliticaPrivacidad: 'S',
      aceptaTerminoUso: 'S'
    };

    return cuenta;
  }

  private _crearCuenta(cuenta: PersonaJuridicaInterface){    
    this.guardar$ = this.dataApiClient.RegistrarPersonaJuridica(cuenta).pipe(
      finalize(() => { } )
    );
    
    this.guardando = true;
    this.subscriptions.push(this.guardar$.subscribe(
      (result: any) => {
        console.warn(result);
        this.guardando = false;
        Swal.fire({
          title: 'Exito!',
          text: 'Su cuenta ha sido creada correctamente, por favor revise su correo  para validar la cuenta.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.resetForm();
      },
      (error) => {
        console.warn(error);
        this.guardando = false;
        Swal.fire({
          title: 'Error!',
          text: 'Ha ocurrido un error por favor intente más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    ));

  }

  resetForm() : void{
    this.formDirective.resetForm();
    this.registrationForm.reset();
  }

}

