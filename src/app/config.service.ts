import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;
  private env: any;

  constructor(private http: HttpClient) { }

  load() {
    return new Promise((resolve, reject) => {
      const jsonType = 'application/json';
      const headers = new HttpHeaders({ Accept: jsonType, 'Content-Type': jsonType, DataType: jsonType });
      const options = { headers };

      this.http.get(`./config/env.json?cache=${Date.now().toString()}`, options)
        .pipe(map(res => res))
        .subscribe((envData: any) => {
          this.env = envData;

          this.http.get(`./config/${envData.env}.json?cache=${Date.now().toString()}`)
            .pipe(map(res => res),
              catchError((error: any) => {
                return throwError(error.error || 'Server error');
              }))
            .subscribe((data) => {
              this.config = data;
              resolve(true);
            });
        });
    });
  }

  /**
   *
   * @param key Config Env key what you get
   */
  getEnv(key: any) {
    return this.env[key];
  }

  /**
   * Returns configuration value based on given key
   *
   * @param key Congig key what you get
   */
  get(key: any) {
    return this.config[key];
  }
}
