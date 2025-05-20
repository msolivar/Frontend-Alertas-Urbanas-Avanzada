import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { LoginService } from '../../servicios/login.service';
// import { Alerta } from '../../dto/alerta';
// import { AlertaComponent } from '../alerta/alerta.component';
import { AuthService } from '../../servicios/auth.service';
import { RecuperarCuentaDTO } from '../../dto/RecuperarCuentaDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-cuenta',
  templateUrl: './recuperar-cuenta.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  styleUrls: ['./recuperar-cuenta.component.css']
})
export class RecuperarCuentaComponent {
  email: string = '';
  // alerta!:Alerta;
  recuperarDTO: RecuperarCuentaDTO;

  constructor(private router: Router, private authService: AuthService ) { 
    this.recuperarDTO = new RecuperarCuentaDTO();
  }

  recuperarContrasena() {
    // Lógica para enviar el correo electrónico y recuperar la contraseña
    this.recuperarDTO.email = this.email; 

    console.log('Enviando correo electrónico a:', JSON.stringify(this.recuperarDTO));
    
    this.authService.enviarLinkRecuperacionPass(this.recuperarDTO).subscribe({
      next: (data) => {
        alert('Revise en su badeja de entrada, si el correo existe se le ha enviado un correo de recuperación');
        this.router.navigate(['/cambiar-contrasena', this.recuperarDTO.email]);
      },
      error: (error) => {
        // console.error(JSON.stringify(error));
        
        if (error.status === 500) {
          console.error('Error de conexión');
        } else {
          if (error.error && error.error.mensaje) {
            console.error("sorry: "+error.error.data[0].mensaje);
          } else {
            console.error('Se produjo un error, por favor verifica tus datos o intenta más tarde.');
          }
        }
      }
    });
  }
}