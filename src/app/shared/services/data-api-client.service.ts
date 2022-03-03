import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ConfigService } from 'src/app/config.service';
import { PaisesInterface } from '../models/paises-interface';
import { ParametrosInterface } from '../models/parametros-interface';

@Injectable({
  providedIn: 'root'
})
export class DataApiClientService {
  api: any;
  dataObj: any;
  
  constructor(
    private http: HttpClient,
    private configService: ConfigService) { 
    this.api = this.configService.get('api');
    this.dataObj = this.api.endpoints.filter((c: { restAPI: any; }) => c.restAPI)[0];
  }

  ConsultaItems(catalogo: string): Observable<Array<ParametrosInterface>> {
    const service = this.dataObj.restAPI.filter((m: any) => m.name === 'Parametros')[0];
    return this.http.get<Array<ParametrosInterface>>(`${this.api.basepath}${service.url}${catalogo}`).pipe(
      catchError(this.handleError)
    );
  }

  ConsultaPaises(): Observable<Array<PaisesInterface>> {
    const service = this.dataObj.restAPI.filter((m: any) => m.name === 'Paises')[0];
    return this.http.get<Array<PaisesInterface>>(`${this.api.basepath}${service.url}`).pipe(
      catchError(this.handleError)
    );
  }

  RegistrarPersonaJuridica(form: any): Observable<any> {
    const registerEndpoint = this.dataObj.restAPI.filter((m: any) => m.name === 'RegistroPersonaJuridica')[0];
    return this.http.post(`${this.api.basepath}${registerEndpoint.url}`, form).pipe(
      catchError(this.handleError)
    );
  }

  RegistrarPersonaNatural(form: any): Observable<any> {
    const registerEndpoint = this.dataObj.restAPI.filter((m: any) => m.name === 'RegistroPersonaNatural')[0];
    return this.http.post(`${this.api.basepath}${registerEndpoint.url}`, form).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
  
}
