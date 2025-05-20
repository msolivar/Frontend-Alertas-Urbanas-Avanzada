import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CambioPasswordDTO } from '../../dto/CambioPasswordDTO';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { TokenService } from '../../servicios/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.css'
})
export class CambiarContrasenaComponent implements OnInit {
  tokenUrl: string = '';
  contraseniasNoCoinciden: boolean = false;
  cambioPasswordDto: CambioPasswordDTO = new CambioPasswordDTO();

  mostrarPassword: boolean = false;

  cambioPassword = {
    token: '',
    correo: '',
    nuevaContrasena: '',
    contraseniaConfirmada: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.route.paramMap.subscribe(params => {
      this.tokenUrl = params.get('token') || '';
    });
  }

  ngOnInit(): void {
    this.cambioPassword.correo = this.tokenUrl;
  }

  public sonIguales(): boolean {
    const password = this.cambioPassword.nuevaContrasena;
    const confirmar = this.cambioPassword.contraseniaConfirmada;

    return (
      password?.trim() !== '' &&
      confirmar?.trim() !== '' &&
      password === confirmar
    );
  }

  cambiarContrasena() {
    this.cambioPasswordDto.token = this.cambioPassword.token;
    this.cambioPasswordDto.email = this.cambioPassword.correo;
    this.cambioPasswordDto.nuevaPassword = this.cambioPassword.nuevaContrasena;

    console.log('Token enviado:', this.cambioPasswordDto);

    this.authService.cambiarContraseña(this.cambioPasswordDto).subscribe({
      next: (data) => {
        
        console.log('Contraseña modificada correctamente');
      },
      error: (error) => {
        console.error(JSON.stringify(error));
        
        if (error.status === 200) {
          alert('Contraseña modificada correctamente');

          this.router.navigate(['/login']);
        }

        // console.error(JSON.stringify(error));

        if (error.status === 500) {
          console.error('Error en el servidor');
        } 
      },
    });
  }
}
