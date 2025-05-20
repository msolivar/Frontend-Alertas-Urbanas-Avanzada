import { Component } from '@angular/core';
import { 
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
  FormsModule 
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroUsuarioService } from '../../servicios/registro-usuario.service';
import { ActualizarClienteDTO } from '../../dto/actualizar-cliente-dto';
import { UsuarioDTO } from '../../dto/usuario-dto';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TokenService } from '../../servicios/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule,
    FormsModule
  ], // Habilitar ngModel
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.css'
})
export class CuentaComponent{
  // Instanciar Clase
  ActualizarClienteDTO: ActualizarClienteDTO;

  // Lista de ciudades
  ciudades: string[];

  //Lista Usuarios 
  usuarios: UsuarioDTO[]; 

  terminoBusqueda: string = '';

  salidaTexto = '';

  // Para alternar visibilidad
  mostrarPassword: boolean = false;

  email: string = '';

  loginForm: FormGroup = new FormGroup({
    idUsuario: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(7)]),
    telefono: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(7)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    ciudad: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required, Validators.minLength(7)]),
    // password: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(7)])
  });

  constructor(private router: Router, 
    private RegistroService: RegistroUsuarioService,
    private tokenService: TokenService) {
    this.ActualizarClienteDTO = new ActualizarClienteDTO();
    this.ciudades = [];
    this.cargarCiudades(); // Llamado para llenar las ciudades

    this.email = this.tokenService.getEmail();
    this.obtenerInformacion(this.email);
    this.usuarios = [];
  }

  public obtenerInformacion(idUsuario: string) {
    this.RegistroService.obtenerUsuario(idUsuario).subscribe({
      next: (data) => {
        console.log(JSON.stringify(data));
        
        if (data) {
          this.usuarios = [data.data];
          const r = data.data;
          
          this.loginForm.get('idUsuario')?.setValue(r.id);
          this.loginForm.get('nombre')?.setValue(r.nombre);
          this.loginForm.get('telefono')?.setValue(r.telefono);
          this.loginForm.get('email')?.setValue(r.email);
          this.loginForm.get('ciudad')?.setValue(r.ciudad);
          this.loginForm.get('direccion')?.setValue(r.direccion);

        } else {
          this.salidaTexto = 'No se encontró el usuario.';
        }
      },
      error: (error) => {

        if (error.status === 404) {
          console.error(error.error.data);
          
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

  public actualizarCuenta() {

    this.ActualizarClienteDTO.nombre = this.loginForm.get('nombre')?.value; 
    this.ActualizarClienteDTO.ciudad = this.loginForm.get('ciudad')?.value;
    this.ActualizarClienteDTO.direccion = this.loginForm.get('direccion')?.value;
    this.ActualizarClienteDTO.telefono = this.loginForm.get('telefono')?.value;
    this.ActualizarClienteDTO.email = this.loginForm.get('email')?.value;
    // this.ActualizarClienteDTO.passwordActual = this.loginForm.get('password')?.value;
    // this.ActualizarClienteDTO.nuevaPassword = this.loginForm.get('password')?.value;

    delete this.ActualizarClienteDTO.nombre;
    // console.log(this.ActualizarClienteDTO);
    this.RegistroService.actualizarUsuario(this.loginForm.get('idUsuario')?.value,this.ActualizarClienteDTO).subscribe({
      next: (data) => {
        console.log(JSON.stringify(data));

        if (data) {
          Swal.fire({text: data.mensaje, icon: 'success', 
            showConfirmButton: false, timer: 2000});

          this.email = this.tokenService.getEmail();
          this.obtenerInformacion(this.email);
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

    // this.RegistroService.actualizarPassword(this.ActualizarClienteDTO).subscribe({
    //   next: (data) => {
    //     console.log(JSON.stringify(data));

    //     if (data) {
    //       alert('Contraseña Actualizada. \n');
    //     }
        
    //   },
    //   error: (error) => {
    //     console.error(JSON.stringify(error));

    //     if (error.status === 500) {
    //       alert(error.error.data);
    //     } else {
    //       if (error.error && error.error.mensaje) {
    //         console.log(error.error.data);
    //       } else {
    //         console.log('Se produjo un error, por favor verifica tus datos o intenta más tarde.');
    //       }
    //     }
    //   },
    // });
  }

  private cargarCiudades() {
    this.ciudades = ['CALI', 'MEDELLIN', 'ARMENIA', 'MANIZALES', 'PEREIRA', 'BOGOTA'];
  }

  public eliminarCuenta(){

    this.RegistroService.eliminarUsuario(this.loginForm.get('idUsuario')?.value).subscribe({
      next:(data) => {
        console.log("Usuario eliminado", JSON.stringify(data));

        alert(data.mensaje);
        
        this.email = this.tokenService.getEmail();
        this.obtenerInformacion(this.email);

        this.tokenService.logout();
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

  //Buscador Palabras
  categoriasFiltradas(): UsuarioDTO[] {
    
    if (!this.terminoBusqueda.trim()) {
      return this.usuarios;
      
    }
  
    const termino = this.terminoBusqueda.toLowerCase();
    const filtradas = this.usuarios.filter(categoria =>
      categoria.nombre.toLowerCase().includes(termino) ||
      categoria.ciudad.toLowerCase().includes(termino)
    );
  
    // Si no hay coincidencias, retornar todas las categorías
    return filtradas.length > 0 ? filtradas : this.usuarios;
  }
}