import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importar RouterModule
import { TokenService } from '../../servicios/token.service';
import { RegistroUsuarioService } from '../../servicios/registro-usuario.service';
import { NotificacionesDTO } from '../../dto/notificaciones-dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  imports: [RouterModule], // Agregar RouterModule para que funcione routerLink
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  title = 'Alerta Urbana';

  isLogged = false;
  isLoggedCliente = false;
  isLoggedAdministrador = false;

  email: string = '';

  // Instanciar Clase
  notificacionesDTO: NotificacionesDTO;

  constructor(private tokenService: TokenService, 
    private RegistroService: RegistroUsuarioService) {

    this.isLogged = this.tokenService.isLogged();
    this.isLoggedCliente = this.tokenService.isLoggedCliente();
    this.isLoggedAdministrador = this.tokenService.isLoggedAdmin();
    this.notificacionesDTO = new NotificacionesDTO();

    if (this.isLogged) {
      this.email = this.tokenService.getEmail();
    }

  }

  public logout() {
    this.tokenService.logout();
  }

  public activarNotificaciones() {

    this.notificacionesDTO.notificacion_app=true;

    this.RegistroService.notificacionesActivarDesactivar(this.email,this.notificacionesDTO).subscribe({
      next: (data) => {
        console.log(JSON.stringify(data));

        if (data) {
          Swal.fire({text: data.mensaje, icon: 'success', 
            showConfirmButton: false, timer: 2000});
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

  public desactivarNotificaciones() {
    
    this.notificacionesDTO.notificacion_app=false;

    this.RegistroService.notificacionesActivarDesactivar(this.email,this.notificacionesDTO).subscribe({
      next: (data) => {
        console.log(JSON.stringify(data));

        if (data) {
          Swal.fire({text: data.mensaje, icon: 'error', 
            showConfirmButton: false, timer: 2000});
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
}
