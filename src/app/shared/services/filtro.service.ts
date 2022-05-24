import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Cliente } from 'src/app/shared/models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class FiltroService {

  constructor(
    private http: HttpClient
  ) { }
  filtrar(parametros:any, pag:number, lim:number): Observable<Cliente>{
    let params = new HttpParams;
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop])
      }
    }
    return this.http.get<Cliente>(`http://tallerbd/filtro/cliente/${pag}/${lim}`,{params:params})
      .pipe(retry(1), catchError(this.handleError));
  //  console.log(params);
  }
  buscar() {

  }
  
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }  
}
