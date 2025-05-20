import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { CambiarEstadoReporteDTO } from '../../dto/cambiar-estado-reporte-dto';
import { ReporteService } from '../../servicios/reporte.service';
import { TokenService } from '../../servicios/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportecambiarestado',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './reportecambiarestado.component.html',
  styleUrl: './reportecambiarestado.component.css'
})
export class ReportecambiarestadoComponent {

  idreporte: string = '';
  ComentarioDTO = new CambiarEstadoReporteDTO();

  comentarios: any[] = []; // Lista que llenaremos como array

  mostrarBotonAgregar: boolean = true;
  terminoBusqueda: string = '';

  reporteSeleccionado: CambiarEstadoReporteDTO = { 
    nuevoEstado: '', 
    motivo: '',
  };

  // Lista de ciudades
  estados: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriasService: ReporteService,
    private tokenService: TokenService
  ) {
    this.route.paramMap.subscribe(params => {
      this.idreporte = params.get('idreporteEstado') || '';
      this.getReporte();
      this.cargarEstados();
    });
  }

  //Limpiar Campos
  // limpiarCampos(){
  //   this.ComentarioDTO.comentarioTexto = ""; 
  //   this.ComentarioDTO.fecha = ""; 
  // }

  //Crear*
  agregarComentario(){

    this.ComentarioDTO.motivo = this.reporteSeleccionado.motivo;
    this.ComentarioDTO.nuevoEstado = this.reporteSeleccionado.nuevoEstado;

    console.log("cambiar Estado",JSON.stringify(this.ComentarioDTO));
    
    this.categoriasService.cambiarEstadoDelReporte(this.ComentarioDTO,this.idreporte).subscribe({
      next: (data) => {

        Swal.fire({text: 'Estado Actualizado', icon: 'success', 
            showConfirmButton: false, timer: 2000});
        
        this.getReporte();
        // this.router.navigate(["/categoria"]).then(() => {
        //   window.location.reload();
        // });
      },
      error: (error) => {
        console.error(JSON.stringify(error));

        if (error.status === 500) {
          console.error('Error en el servidor');
        } else {
          if (error.error && error.error.mensaje) {
            console.log(error.error.mensaje);
          } else {
            console.log('Se produjo un error, por favor verifica tus datos o intenta más tarde.');
          }
        }
      },
    });
    
  }

  public getReporte(): void {
    this.categoriasService.obtenerReporte(this.idreporte).subscribe({
      next: (data) => {
        // Convertimos el objeto en arreglo para que *ngFor funcione
        this.comentarios = [data];
        console.log("Reporte encontrado: ", data);
      },
      error: (error) => {
        console.error(error);
        if (error.status === 500) {
          console.error('Error en el servidor');
        } else if (error.error?.mensaje) {
          console.log(error.error.mensaje);
        } else {
          console.log('Se produjo un error, por favor verifica tus datos o intenta más tarde.');
        }
      }
    });
  }

  //Estados Reportes
  //PENDIENTE, VERIFICADO, RECHAZADO, ELIMINADO, RESUELTO

  private cargarEstados() {
    this.estados = ['RESUELTO'];
  }

}
