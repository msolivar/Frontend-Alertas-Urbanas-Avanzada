import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CambioPasswordDTO } from '../../dto/CambioPasswordDTO';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroUsuarioService } from '../../servicios/registro-usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activar-cuenta',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './activar-cuenta.component.html',
  styleUrl: './activar-cuenta.component.css'
})
export class ActivarCuentaComponent implements OnInit {
  tokenEmail: string = '';
  contraseniasNoCoinciden: boolean = false;

  mostrarPassword: boolean = false;

  cambioPassword = {
    token: '',
    correo: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private RegistroUsuarioService: RegistroUsuarioService
  ) {
    this.route.paramMap.subscribe(params => {
      this.tokenEmail = params.get('email') || '';
    });
  }

  ngOnInit(): void {
    this.cambioPassword.correo = this.tokenEmail;
  }

  ActivarCuenta() {

    this.RegistroUsuarioService.activarUsuario(this.cambioPassword.correo, this.cambioPassword.token).subscribe({
      next: (data) => {
        alert(data.mensaje)
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(JSON.stringify(error));
        alert(error.error.mensaje)

        if (error.status === 200) {
          alert('No se puede activar la cuenta');

          this.router.navigate(['/']);
        }

        // console.error(JSON.stringify(error));

        if (error.status === 500) {
          console.error('Error en el servidor');
        }
      },
    });
  }
}

