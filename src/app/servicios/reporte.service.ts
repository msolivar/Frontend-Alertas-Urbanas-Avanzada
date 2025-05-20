import { Injectable } from '@angular/core';
import { ReporteDTO } from '../dto/reporte-dto';
import { ActualizarReporteDTO } from '../dto/actualizar-reporte-dto';
import { CambiarEstadoReporteDTO } from '../dto/cambiar-estado-reporte-dto';
import { ReportesCercanosDTO } from '../dto/reportes-cercanos-dto';
import { CalificarReporteDTO } from '../dto/calificar-reporte-dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/MensajeDTO';
import { RutasDeNavegacion } from './rutadenavegacion';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private authURL = RutasDeNavegacion.apiUrl+"reportes";

  constructor(private http: HttpClient) { }

  public crearReporte(ReporteNuevo: ReporteDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}`, ReporteNuevo);
  }

  public actualizarReporte(actualizarReporte: ActualizarReporteDTO, 
    codigoReporte: string | undefined): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/${codigoReporte}`, actualizarReporte);
  }

  public cambiarEstadoDelReporte(actualizarReporte: CambiarEstadoReporteDTO, 
    codigoReporte: string | undefined): Observable<any> {
    return this.http.put<any>(`${this.authURL}/${codigoReporte}/estado`, actualizarReporte);
  }

  public obtenerReporte(codigoReporte: string): Observable<any> {
    return this.http.get<any>(`${this.authURL}/${codigoReporte}`);
  }

  public eliminarReporte(codigoReporte: string | undefined): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.authURL}/${codigoReporte}`);
  }

  public obtenerReportes(size: string): Observable<any> {
    return this.http.get<any>(`${this.authURL}?page=0&size=${size}`);
  }

  //Los Usuarios no pueden marcar su propio reporte
  public marcarReporteImportante(codigoReporte: string | undefined): Observable<any> {
    return this.http.post<any>(`${this.authURL}/${codigoReporte}/importante`, codigoReporte);
  }

  //Los Usuarios no pueden calificar su propio reporte
  public calificarReporte(ReporteNuevo: CalificarReporteDTO, 
    codigoReporte: string | undefined): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/${codigoReporte}/calificacion`, ReporteNuevo);
  }

  public reportesCercanos(ReporteNuevo: ReportesCercanosDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/cercanos`, ReporteNuevo);
  }

  public consultarMisReportes(): Observable<any> {
    return this.http.get<any>(`${this.authURL}/mis-reportes`);
  }

  //Parametros
  public generarInformeDelReporte(categoria:string, fechaInicio:string, fechaFin:string): Observable<any> {
    return this.http.get<any>(`${this.authURL}/informe?categoria=${categoria}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  public filtrarCategoriaReportes(categoria:string, fechaInicio:string, fechaFin:string): Observable<any> {
    return this.http.get<any>(`${this.authURL}/filtrados?categoria=${categoria}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  public filtrosReportes(consultarCampo: string, categoria: string, estado: string,
    fechaInicio:string, fechaFin:string, latitud: number, longitud: number
  ): Observable<any> {
    return this.http.get<any>(`
      ${this.authURL}/buscar?txtConsulta=${consultarCampo}&categoria=${categoria}&estado=${estado}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&latitud=${latitud}&longitud=${longitud}`);
  }

}
