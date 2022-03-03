import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, Observable, Subscription } from 'rxjs';
import { matchValidator } from 'src/app/providers/CustomValidators';
import { PaisesInterface } from 'src/app/shared/models/paises-interface';
import { ParametrosInterface } from 'src/app/shared/models/parametros-interface';
import { PersonaNaturalInterface } from 'src/app/shared/models/persona-natural-interface';
import { DataApiClientService } from 'src/app/shared/services/data-api-client.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-persona-natural',
  templateUrl: './persona-natural.component.html',
  styleUrls: ['./persona-natural.component.css']
})
export class PersonaNaturalComponent implements OnInit {

  @ViewChild('ngForm')
  formDirective!: FormGroupDirective;
  
  submitted: boolean = false;
  guardando: boolean = false;
  nacionalidades: Array<PaisesInterface> = [];
  comoNosContacto: Array<ParametrosInterface> = [];
  private subscriptions: Array<Subscription> = [];
  guardar$: Observable<any> | undefined;

  registrationForm: FormGroup = new FormGroup({
    nombres: new FormControl(null, [
      Validators.required
    ]),
    apellidos: new FormControl(null, [
      Validators.required
    ]),
    cedula: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    fechaNacimiento: new FormControl(null, [
      Validators.required
    ]),
    telefono: new FormControl(null, [
      Validators.required
    ]),
    nacionalidad: new FormControl(null, [
      Validators.required
    ]),
    correoElectronico: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),
    contrasenia: new FormControl(null, [
      Validators.required,
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*+$¡])[A-Za-z\d*+$¡].{6,}'),
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
  get cedula() { return this.registrationForm.get('cedula'); }

  constructor(private formBuilder: FormBuilder,
    private dataApiClient: DataApiClientService,
    private router: Router
    ) { }

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

  obtenerCuenta(): PersonaNaturalInterface{
    let cuenta: PersonaNaturalInterface;
    
    cuenta = {
      tipoCliente: 'INVERSIONISTA',
      tipoPersona: 'NAT',
      tipoIdentificacion: 'CED',
      identificacion: this.db['cedula'].value,
      nacionalidad: this.db['nacionalidad'].value,
      nombres: (this.db['nombres'].value as string).toUpperCase(),
      apellidos: (this.db['apellidos'].value as string).toUpperCase(),
      fechaNacimiento: this.db['fechaNacimiento'].value,
      email: this.db['correoElectronico'].value,
      numeroCelular: this.db['telefono'].value,
      clave: this.db['contrasenia'].value,
      tipoContacto: 'RS',
      aceptaPoliticaPrivacidad: 'S',
      aceptaTerminoUso: 'S'
    };

    return cuenta;
  }

  private _crearCuenta(cuenta: PersonaNaturalInterface){    
    this.guardar$ = this.dataApiClient.RegistrarPersonaJuridica(cuenta).pipe(
      finalize(() => { } )
    );
    
    this.guardando = true;
    this.subscriptions.push(this.guardar$.subscribe(
      (result: string) => {
        console.warn(result);
        this.guardando = false;
        Swal.fire({
          title: 'Exito!',
          text: 'Su cuenta ha sido creada correctamente, nos pondremos en contacto con usted.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(()=>{
          //this.resetForm();
          this.router.navigateByUrl('/')
        });
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

  // Only Integer Numbers
  keyPressNumbers(event: { which: any; keyCode: any; preventDefault: () => void; }) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
