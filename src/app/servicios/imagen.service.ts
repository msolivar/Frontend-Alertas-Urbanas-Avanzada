import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/MensajeDTO';
import { RutasDeNavegacion } from './rutadenavegacion';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  private imgURL = RutasDeNavegacion.apiUrl+"imagenes";
  
  constructor(private http: HttpClient) { }

  public subir(imagen: FormData): Observable<any> {
    return this.http.post<any>(`${this.imgURL}`, imagen);
  }
  
}
