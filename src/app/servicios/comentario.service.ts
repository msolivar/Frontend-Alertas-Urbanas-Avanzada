import { Injectable } from '@angular/core';
import { ComentarioDTO } from '../dto/ComentarioDTO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/MensajeDTO';
import { RutasDeNavegacion } from './rutadenavegacion';

@Injectable({
    providedIn: 'root'
})
export class ComentarioService {

    private authURL = RutasDeNavegacion.apiUrl + "comentarios";

    constructor(private http: HttpClient) { }

    public crearComentario(codigoComentario: string | undefined, comentarioNuevo: ComentarioDTO): Observable<MensajeDTO> {
        return this.http.post<MensajeDTO>(`${this.authURL}/${codigoComentario}`, comentarioNuevo);
    }

    public obtenerComentarios(codigoComentario: string): Observable<any> {
        return this.http.get<any>(`${this.authURL}/${codigoComentario}`);
    }
}