import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroUsuarioService } from '../../servicios/registro-usuario.service';
import { ReporteDTO } from '../../dto/reporte-dto';
import { consultarMisReportesDTO } from '../../dto/consultar-mis-reporte-dto';
import { ActualizarReporteDTO } from '../../dto/actualizar-reporte-dto';
import { ReporteService } from '../../servicios/reporte.service';
import { CategoriasService } from '../../servicios/categorias.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TokenService } from '../../servicios/token.service';
import { ImagenService } from '../../servicios/imagen.service';
import { MapaService } from '../../servicios/mapa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule], // Habilitar ngModel
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {
  //Inicializar Clase
  reporteDTO = new ReporteDTO();

  reporteActualizarDTO = new ActualizarReporteDTO();

  //Lista Reportes 
  misReportes: consultarMisReportesDTO[];

  //Lista Categorias 
  categorias: { id: string, nombre: string }[] = [];

  // Archivos
  archivos!: FileList;

  terminoBusqueda: string = '';

  salidaTexto: string = '';

  //Imagen
  imagenUrl: string = '';
  cargando: boolean = false;
  mensaje: string = '';

  //Filtro
  filtroNombre: FormControl = new FormControl('');
  reportesFiltrados: consultarMisReportesDTO[] = [];

  //monstrar boton agregar y actualizar
  mostrarBotonAgregar: boolean = true;

  loginForm: FormGroup = new FormGroup({
    reporteId: new FormControl('', [Validators.maxLength(100)]),
    titulo: new FormControl('', [Validators.required, Validators.minLength(7)]),
    categoria: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(7)]),
    imagen: new FormControl('', [Validators.maxLength(100)]),
  });

  constructor(private router: Router,
    private registroService: RegistroUsuarioService,
    private reporteService: ReporteService,
    private categoriasService: CategoriasService,
    private tokenService: TokenService,
    private imagenService: ImagenService,
    private mapaService: MapaService
  ) {

    this.reporteDTO = new ReporteDTO();
    this.categorias = [];
    this.cargarCategoria();
    this.cargarEmail();
    this.getMisReporte();
    this.misReportes = [];
    this.imagenUrl = "";
  }

  ngOnInit(): void {
    this.filtroNombre.valueChanges.subscribe(valor => {
      this.filtrarReportes(valor);
    });

    this.mapaService.crearMapa();

    this.mapaService.agregarMarcador().subscribe((marcador) => {

      this.reporteDTO.ubicacionDTO.latitud = marcador.lat;
      this.reporteDTO.ubicacionDTO.longitud = marcador.lng;
    });
    
  }

  public imprimirReporteDTO(){
    console.log("cordenadas", JSON.stringify(this.reporteDTO));
  }

  public onFileChange(event: any): void {
    const archivo: File = event.target.files[0];
    if (!archivo) {
      this.mensaje = 'Selecciona una imagen.';
      return;
    }

    const formData = new FormData();
    formData.append('archivo', archivo);

    this.cargando = true;
    this.mensaje = '';

    this.imagenService.subir(formData).subscribe({
      next: (respuesta) => {

        console.log("data", JSON.stringify(respuesta));

        this.imagenUrl = respuesta.data.secure_url;
        this.mensaje = 'Imagen subida con éxito.';
        this.cargando = false;
        this.reporteDTO.rutaImagenes = this.imagenUrl;
      },
      error: (error) => {
        this.mensaje = 'Error al subir la imagen.';
        console.error("error", JSON.stringify(error));
        this.cargando = false;
      }
    });


  }

  // Formulario*
  compararCategorias = (a: any, b: any): boolean => {
    return a && b ? a.id === b.id : a === b;
  };
  
  editarFormulario(reporte: consultarMisReportesDTO): void {
    this.mostrarBotonAgregar = false;
    this.loginForm.get('titulo')?.setValue(reporte.nombre);
    this.loginForm.get('descripcion')?.setValue(reporte.descripcion);
    this.loginForm.get('categoria')?.setValue(reporte.categoria); 
    this.loginForm.get('reporteId')?.setValue(reporte.id); 
  }

  //registrar
  public registrar(): void {

    const fechaActual: string = new Date().toISOString();

    this.reporteDTO.titulo = this.loginForm.get('titulo')?.value;
    this.reporteDTO.categoria = this.loginForm.get('categoria')?.value;
    this.reporteDTO.descripcion = this.loginForm.get('descripcion')?.value;
    this.reporteDTO.fechaCreacion = fechaActual;
    this.reporteDTO.estado = 'PENDIENTE';

    console.log(this.reporteDTO);

    // delete this.registroClienteDTO.confirmaPassword;

    this.reporteService.crearReporte(this.reporteDTO).subscribe({
      next: (data) => {
        console.log(JSON.stringify(data));

        if (data) {
          Swal.fire({text: 'Reporte registrado', icon: 'success', 
            showConfirmButton: false, timer: 2000});
          this.getMisReporte();
        }

      },
      error: (error) => {
        console.error(JSON.stringify(error));

        if (error.status === 500) {
          alert(error.error.data);
        } else {
          if (error.error && error.error.mensaje) {
            console.log(error.error.data);
          } else {
            console.log('Se produjo un error, por favor verifica tus datos o intenta más tarde.');
          }
        }
      },
    });
  }

  //Actualizar
  actualizarCategoria(): void {

    this.reporteActualizarDTO.nombre = this.loginForm.get('titulo')?.value; 
    this.reporteActualizarDTO.categoria = this.loginForm.get('categoria')?.value; 
    this.reporteActualizarDTO.descripcion = this.loginForm.get('descripcion')?.value;  
    
    // console.log(JSON.stringify(this.reporteActualizarDTO));

    this.reporteService.actualizarReporte(this.reporteActualizarDTO, this.loginForm.get('reporteId')?.value).subscribe({
      next: (data) => {
        
        Swal.fire({text: 'Reporte actualizado', icon: 'success', 
            showConfirmButton: false, timer: 2000});
        this.getMisReporte();
        this.mostrarBotonAgregar = true;

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

  //Eliminar*
  eliminarReporte(id: string | undefined ): void {
    
    this.reporteService.eliminarReporte(id).subscribe({
      next:(data) => {
        console.log("Reporte eliminado", JSON.stringify(data));

        this.getMisReporte();
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
      }
    })
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

  public cargarEmail() {

    let idUsuario = this.tokenService.getEmail();

    this.registroService.obtenerUsuario(idUsuario).subscribe({
      next: (data) => {
        console.log("Usuario encontrado: ", JSON.stringify(data));

        if (data) {
          const r = data.data;

          this.reporteDTO.idUsuario = r.id;

        } else {
          console.error('No se encontró el usuario.');
        }
      },
      error: (error) => {

        if (error.status === 404) {
          this.salidaTexto = 'Usuario no encontrado.';
        } else if (error.status === 403) {
          this.salidaTexto = 'Usuario no autentificado';
        } else {
          this.salidaTexto = 'Error al obtener la información.';
        }

        // console.error(JSON.stringify(error));
      },
    });
  }

  public getMisReporte() {
    this.reporteService.consultarMisReportes().subscribe({
      next: (data) => {
        // console.log("Mis Reportes",JSON.stringify(data));

        if (data) {
          this.misReportes = data;
          this.reportesFiltrados = [...this.misReportes];

          console.log("Asignar mis reportes", this.misReportes);

          // this.salidaTexto = Nombre: ${r.nombre}, Email: ${r.email}, ciudad: ${r.ciudad}
          // Telefono: ${r.telefono}, Direccion: ${r.direccion};
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

  public filtrarReportes(valor: string): void {
    const filtro = valor.toLowerCase();
    this.reportesFiltrados = this.misReportes.filter(reporte =>
      reporte.nombre.toLowerCase().includes(filtro)
    );
  }

  public EstadoReporte(idReporte: string ): void{

    // Ejemplo: navegar a una ruta de comentarios
    this.router.navigate(['/reporte-cambiar-estado', idReporte]);
  }

}