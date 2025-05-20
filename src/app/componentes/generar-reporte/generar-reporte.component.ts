import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { consultarMapaDTO } from '../../dto/consultar-mapas';
import { GenerarReporteDTO } from '../../dto/generar-reporte-dto';
import { consultarMisReportesDTO } from '../../dto/consultar-mis-reporte-dto';
import { ReporteService } from '../../servicios/reporte.service';
import { CategoriasService } from '../../servicios/categorias.service';
import { TokenService } from '../../servicios/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generar-reporte',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './generar-reporte.component.html',
  styleUrl: './generar-reporte.component.css'
})
export class GenerarReporteComponent implements OnInit {
  idreporte: string = '';
  ComentarioDTO = new GenerarReporteDTO();

  //Lista Categorias
  categorias: { id: string, nombre: string }[] = [];

  comentarios: consultarMapaDTO[]; // Lista que llenaremos como array

  mostrarBotonAgregar: boolean = true;
  terminoBusqueda: string = '';

  reporteSeleccionado: GenerarReporteDTO = {
    categoria: '', 
    fechaInicio: '',
    fechaFinal: '',
  };

  // Lista de ciudades
  estados: string[] = [];

  //Filtro
  filtroNombre: FormControl = new FormControl('');
  reportesFiltrados: consultarMapaDTO[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriasService: CategoriasService,
    private reporteService: ReporteService,
    private tokenService: TokenService
  ) {
    this.categorias = [];
    this.comentarios = [];
    this.cargarCategoria();
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
    this.reporteSeleccionado.categoria = ""; 
    this.reporteSeleccionado.fechaInicio = "";
    this.reporteSeleccionado.fechaFinal = "";
  }

  

  // // Formulario*
  // editarFormulario(categoria: consultarMapaDTO): void {
  //   this.reporteSeleccionado.idReporte = categoria.id;
  // }

  //Crear*
  cambiarEstado(){

    this.ComentarioDTO.categoria = this.reporteSeleccionado.categoria;
    this.ComentarioDTO.fechaInicio = this.reporteSeleccionado.fechaInicio+"T13%3A00%3A00";
    this.ComentarioDTO.fechaFinal = this.reporteSeleccionado.fechaFinal+"T23%3A13%3A31";

    console.log("Generar Reporte",JSON.stringify(this.ComentarioDTO));
    
    this.reporteService.generarInformeDelReporte(
      this.ComentarioDTO.categoria,
      this.ComentarioDTO.fechaInicio,
      this.ComentarioDTO.fechaFinal
    ).subscribe({
      next: (data) => {
        console.log(JSON.stringify(data));
        
        // Swal.fire({text: data.mensaje, icon: 'success', 
        //     showConfirmButton: false, timer: 2000});

        this.getReportes();
        this.limpiarCampos();
        // this.router.navigate(["/categoria"]).then(() => {
        //   window.location.reload();
        // });
      },
      error: (error) => {
        // console.error(JSON.stringify(error));

        window.open(error.url, '_blank');

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

  public cargarCategoria(): void {

    this.categoriasService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data.data;

        console.log("Categorias encontradas: ", JSON.stringify(data));
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
      }
    })
  }

  public filtrarReportes(valor: string): void {
    const filtro = valor.toLowerCase();
    this.reportesFiltrados = this.comentarios.filter(reporte =>
      reporte.nombre.toLowerCase().includes(filtro) ||
      reporte.categoria.toLowerCase().includes(filtro)
    );
  }
}