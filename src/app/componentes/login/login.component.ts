import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../servicios/login.service';
import { TokenService } from '../../servicios/token.service';
import { AuthService } from '../../servicios/auth.service';
import { LoginDTO } from '../../dto/LoginDTO';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginDTO: LoginDTO;
  mostrarPassword: boolean = false; // Para alternar visibilidad

  loginForm: FormGroup = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(7)
    ]),
  });

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private authService: AuthService
  ) {
    this.loginDTO = new LoginDTO(); 
  }

  ngOnInit(): void {
    this.loginForm.patchValue({
      correo: 'admin@reportes.com',
      password: '123456789'
    });
  }

  public login(): void {
    this.loginDTO.email = this.loginForm.get('correo')?.value;
    this.loginDTO.password = this.loginForm.get('password')?.value;
    console.log('this login', this.loginDTO);

    this.authService.loginCliente(this.loginDTO).subscribe({
      next: (data) => {
        this.tokenService.login(data.token);
      },
      error: (error) => {
        if (error.status === 400) {
          console.log('Error de conexión');
        } else {
          if (error.error && error.error.mensaje) {

            Swal.fire({text: error.error.data, icon: 'error',
            showConfirmButton: false, timer: 2000});

          } else {
            console.log('Se produjo un error, por favor verifica tus datos o intenta más tarde.');
          }
        }
      }
    });
  }
}
