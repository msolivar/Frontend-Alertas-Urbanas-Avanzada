import { Injectable } from '@angular/core';
import { CategoriaDTO } from '../dto/CategoriaDTO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/MensajeDTO';
import { RutasDeNavegacion } from './rutadenavegacion';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private authURL = RutasDeNavegacion.apiUrl+"categorias";

  constructor(private http: HttpClient) { }

  public crearCategoria(categoriaNueva: CategoriaDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}`, categoriaNueva);
  }

  public actualizarCategoria(actualizacionCategoria: CategoriaDTO, 
    codigoCategoria: string | undefined): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/${codigoCategoria}`, actualizacionCategoria);
  }

  public obtener(codigoCategoria: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/${codigoCategoria}`);
  }

  public eliminarCategoria(codigoCategoria: string | undefined): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.authURL}/${codigoCategoria}`);
  }

  public obtenerCategorias(): Observable<any> {
    return this.http.get<any>(`${this.authURL}`);
  }

}
