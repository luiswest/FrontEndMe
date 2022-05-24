import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Cliente } from 'src/app/shared/models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  apiURL = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };  
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
  buscar(id : number) : Observable<Cliente> {
    return this.http.get<Cliente>(`http://tallerbd/cliente/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  guardar(datos : Cliente, id? : any) : Observable<any> {        
    if (id) {
      return this.http.put<Cliente>(`http://tallerbd/cliente/${id}`, datos)
        .pipe(retry(1), catchError(this.handleError));    
    } else {
          return this.http.post<Cliente>(`http://tallerbd/cliente`, datos, this.httpOptions)
            .pipe(retry(1), catchError(this.handleError));    
    }
  }
  eliminar(id : number) {
    return this.http.delete<Cliente>(`http://tallerbd/cliente/${id}`)
      .pipe(retry(1), catchError(this.handleError));    
  }
  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    });
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
      return error;
    });
  }  
}
