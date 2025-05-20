import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistroClienteDTO } from '../dto/registro-cliente-dto';
import { ActualizarClienteDTO } from '../dto/actualizar-cliente-dto';
import { NotificacionesDTO } from '../dto/notificaciones-dto';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/MensajeDTO';
import { RutasDeNavegacion } from './rutadenavegacion';

@Injectable({
  providedIn: 'root',
})
export class RegistroUsuarioService {
  constructor(private http: HttpClient) {}

  private apiUrl = RutasDeNavegacion.apiUrl + 'usuarios';

  public obtenerUsuario(idUsuario: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idUsuario}`);
  }

  public registrarUsuario(clienteData: RegistroClienteDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(this.apiUrl + '/registro', clienteData);
  }

  public actualizarUsuario(idUsuario: string, clienteData: ActualizarClienteDTO,): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idUsuario}`, clienteData);
  }
  
  public actualizarPassword(clienteData: ActualizarClienteDTO,): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar-password`, clienteData);
  }

  public eliminarUsuario(idUsuario: string | undefined): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${idUsuario}`);
  }

  public activarUsuario(correo: string, token: string): Observable<any> {
    return this.http.put<any>(this.apiUrl +`/activar/${correo}/${token}`,null);
  }

  public reenviarToken(correo: string): Observable<any> {
    return this.http.post<any>(this.apiUrl +`/reenviar-token?email=${correo}`,null);
  }

  public notificacionesActivarDesactivar(idUsuario: string, notificacionesData: NotificacionesDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl + `/notificaciones/suscribirse?idUsuario=${idUsuario}`, notificacionesData);
  }
}
