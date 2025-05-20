import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { consultarMapaDTO } from '../../dto/consultar-mapas';
import { CambiarEstadoReporteDTO } from '../../dto/cambiar-estado-reporte-dto';
import { ReporteService } from '../../servicios/reporte.service';
import { TokenService } from '../../servicios/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportecambiarestadoadminstrador',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './reportecambiarestadoadminstrador.component.html',
  styleUrl: './reportecambiarestadoadminstrador.component.css'
})
export class ReportecambiarestadoadminstradorComponent implements OnInit {
  idreporte: string = '';
  ComentarioDTO = new CambiarEstadoReporteDTO();

  comentarios: consultarMapaDTO[]; // Lista que llenaremos como array

  mostrarBotonAgregar: boolean = true;
  terminoBusqueda: string = '';

  reporteSeleccionado: CambiarEstadoReporteDTO = {
    idReporte: '',
    nuevoEstado: '', 
    motivo: '',
  };

  // Lista de ciudades
  estados: string[] = [];

  //Filtro
  filtroNombre: FormControl = new FormControl('');
  reportesFiltrados: consultarMapaDTO[] = []

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriasService: ReporteService,
    private reporteService: ReporteService,
    private tokenService: TokenService
  ) {
    this.comentarios = [];

    this.route.paramMap.subscribe(params => {
      this.idreporte = params.get('idreporteEstado') || '';
      this.getReportes();
      this.cargarEstados();
    });
  }

  ngOnInit(): void {
    this.filtroNombre.valueChanges.subscribe(valor => {
      this.filtrarReportes(valor);
    });
  }

  //Limpiar Campos
  limpiarCampos(){
    this.reporteSeleccionado.idReporte = ""; 
    this.reporteSeleccionado.motivo = "";
    this.reporteSeleccionado.nuevoEstado = "";
  }

  // Formulario*
  editarFormulario(categoria: consultarMapaDTO): void {
    this.reporteSeleccionado.idReporte = categoria.id;
  }

  //Crear*
  cambiarEstado(){

    this.ComentarioDTO.idReporte = this.reporteSeleccionado.idReporte;
    this.ComentarioDTO.motivo = this.reporteSeleccionado.motivo;
    this.ComentarioDTO.nuevoEstado = this.reporteSeleccionado.nuevoEstado;

    console.log("cambiar Estado",JSON.stringify(this.ComentarioDTO));
    
    this.categoriasService.cambiarEstadoDelReporte(this.ComentarioDTO,this.ComentarioDTO.idReporte).subscribe({
      next: (data) => {
        console.log(JSON.stringify(data));
        
        Swal.fire({text: data.mensaje, icon: 'success', 
            showConfirmButton: false, timer: 2000});

        this.getReportes();
        this.limpiarCampos();
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

  public getReportes(): void {

    this.reporteService.obtenerReportes("60").subscribe({
      next: (data) => {

        if (data) {
          this.comentarios = data;
          this.reportesFiltrados = [...this.comentarios];     
          console.log("Reporte encontrados: ", data);

        } else {
          // this.salidaTexto = 'No se encontró el reporte';
        }
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

  //Estados Reportes
  //PENDIENTE, VERIFICADO, RECHAZADO, ELIMINADO, RESUELTO

  private cargarEstados() {
    this.estados = ['VERIFICADO', 'RECHAZADO', 'ELIMINADO', 'RESUELTO'];
  }

  public filtrarReportes(valor: string): void {
    const filtro = valor.toLowerCase();
    this.reportesFiltrados = this.comentarios.filter(reporte =>
      reporte.nombre.toLowerCase().includes(filtro) ||
      reporte.estado.toLowerCase().includes(filtro)
    );
  }
}
