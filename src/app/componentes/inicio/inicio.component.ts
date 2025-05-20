import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { consultarMisReportesDTO } from '../../dto/consultar-mis-reporte-dto';
import { consultarMapaDTO } from '../../dto/consultar-mapas';
import { CalificarReporteDTO } from '../../dto/calificar-reporte-dto';
import { ReporteService } from '../../servicios/reporte.service';
import { HttpClient } from '@angular/common/http';
import { MapaService } from '../../servicios/mapa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  paginacion: string = '';
  //Lista Reportes 
  misReportes: consultarMapaDTO[];

  salidaTexto: string = '';

  paginas = [
    { numero: 1, offset: 10 },
    { numero: 2, offset: 20 },
    { numero: 3, offset: 30 },
    { numero: 4, offset: 40 },
    { numero: 5, offset: 50 },
    { numero: 6, offset: 60 },
  ];

  anteriorOffset = 0;  // o calcula dinámicamente según la página actual
  siguienteOffset = 70;

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private reporteService: ReporteService,
    private mapaService: MapaService) {

    this.getMisReporte();
    this.misReportes = [];

    this.route.paramMap.subscribe(params => {
      this.paginacion = params.get('pagina') || '';
    });

  }

  ngOnInit(): void {
    this.mapaService.crearMapa();
  }

  // cargarMapa(){
  //   console.log("Mapa");
    
  //   this.mapaService.agregarMarcador(4.5342538812267605, -75.67251821051863, "Mi reporte");
  // }

  public getMisReporte() {
    this.reporteService.obtenerReportes(this.paginacion).subscribe({
      next: (data) => {

        if (data) {
          this.misReportes = data;

          console.log("Reportes Encontrados", JSON.stringify(data));
          
          const reportesVerificados = this.misReportes.filter(r => r.estado === 'VERIFICADO');

          this.mapaService.pintarMarcadores(reportesVerificados);

          // this.misReportes.forEach(r => {
          //   if (r.ubicacion && typeof r.ubicacion.x === 'number' && typeof r.ubicacion.y === 'number') {
          //     this.mapaService.agregarMarcadores(r.ubicacion.y, r.ubicacion.x, r.nombre);
          //   }
          // });

        } else {
          this.salidaTexto = 'No se encontró el reporte';
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

  public agregarComentario(idReporte: string): void {
    // Aquí puedes abrir un modal, redirigir, o llamar a un servicio
    console.log("Agregar comentario al reporte con ID:", idReporte);

    // Ejemplo: navegar a una ruta de comentarios
    this.router.navigate(['/comentarios', idReporte]);
  }

  public agregarReporteImportante(idReporte: string): void {

    // Aquí puedes abrir un modal, redirigir, o llamar a un servicio
    console.log("Agregar reporte importante con ID:", idReporte);

    this.reporteService.marcarReporteImportante(idReporte).subscribe({
      next: (data) => {
        console.log("Mis Reportes", JSON.stringify(data));

        Swal.fire({text: data.mensaje, icon: 'success', 
            showConfirmButton: false, timer: 2000});

        if (data) {

          // this.reportesFiltrados = [...this.misReportes];
          // console.log("Reportes Encontrados", this.misReportes);

        } else {
          this.salidaTexto = 'No se encontró el reporte';
        }
      },
      error: (error) => {
        console.error(JSON.stringify(error));

        if (error.status === 500) {
          console.error('Error en el servidor');
        } else {
          if (error.error && error.error.mensaje) {

            Swal.fire({text: error.error.mensaje, icon: 'error',
            showConfirmButton: false, timer: 2000});

          } else {
            console.log('Se produjo un error, por favor verifica tus datos o intenta más tarde.');
          }
        }
      },
    });
  }

  estrellasArray = [1, 2, 3, 4, 5];
  calificacion: number = 0;
  hovered: number = 0;

  calificar(valor: number, idReporte: string) {
    this.calificacion = valor;

    const dto = new CalificarReporteDTO(valor.toString());

    this.reporteService.calificarReporte(dto, idReporte).subscribe({
      next: (res) => {
        console.log('Calificación enviada:', /*JSON.stringify(res)*/);

        this.getMisReporte();
      },
      error: (error) => {
        console.error('Error al calificar:', JSON.stringify(error));

        if (error.status === 500) {
          console.error('Error en el servidor');
        } else {
          if (error.error && error.error.mensaje) {
            Swal.fire({text: error.error.mensaje, icon: 'error',
            showConfirmButton: false, timer: 2000});
          } else {
            console.log('Se produjo un error, por favor verifica tus datos o intenta más tarde.');
          }
        }
      }
    });
  }

}
