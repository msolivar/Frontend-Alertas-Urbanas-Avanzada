import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistroUsuarioDTO } from '../dto/RegistroUsuarioDTO';
import { Observable } from 'rxjs';
import { LoginDTO } from '../dto/LoginDTO';
import { MensajeDTO } from '../dto/MensajeDTO';
import { CambioPasswordDTO } from '../dto/CambioPasswordDTO';
import { RecuperarCuentaDTO } from '../dto/RecuperarCuentaDTO';
import { RutasDeNavegacion } from './rutadenavegacion';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authURL = RutasDeNavegacion.apiUrl+"auth";

  constructor(private http: HttpClient) { }

  public login(loginData: { correo: string, password: string }): Observable<any> {
    return this.http.post(`${this.authURL}/login`, loginData);
  }

  public registrarCliente(cliente: RegistroUsuarioDTO): Observable<MensajeDTO>{
    return this.http.post<MensajeDTO>(`${this.authURL}/registro`, cliente);
  }

  public loginCliente(loginDTO: LoginDTO): Observable<MensajeDTO>{
    return this.http.post<MensajeDTO>(`${this.authURL}/login`, loginDTO);
  }
  
  public enviarLinkRecuperacionPass(RecuperarCuentaDTO: RecuperarCuentaDTO): Observable<any> {
    return this.http.post<any>(`${this.authURL}/recuperarPassword`, RecuperarCuentaDTO);
  }

  public cambiarContraseña(cambioPasswordDTO: CambioPasswordDTO): Observable<any> {
    return this.http.post<any>(`${this.authURL}/cambiar-password`, cambioPasswordDTO);
  }

}