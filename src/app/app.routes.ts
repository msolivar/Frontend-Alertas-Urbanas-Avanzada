import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { RecuperarCuentaComponent } from './componentes/recuperar-cuenta/recuperar-cuenta.component';
import { CambiarContrasenaComponent } from './componentes/cambiar-contrasena/cambiar-contrasena.component';
import { ActivarCuentaComponent } from './componentes/activar-cuenta/activar-cuenta.component';
import { CategoriaComponent } from './componentes/categoria/categoria.component';
import { CuentaComponent } from './componentes/cuenta/cuenta.component';
import { ReportesComponent }  from './componentes/reportes/reportes.component';
import { ReportecambiarestadoComponent }  from './componentes/reportecambiarestado/reportecambiarestado.component';
import { ReportecambiarestadoadminstradorComponent }  from './componentes/reportecambiarestadoadminstrador/reportecambiarestadoadminstrador.component';
import { ComentariosComponent }  from './componentes/comentarios/comentarios.component';
import { GenerarReporteComponent }  from './componentes/generar-reporte/generar-reporte.component';
import { RolesGuard } from './guards/roles.service';

export const routes: Routes = [
  { path: 'inicio/:pagina', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar-cuenta', component: RecuperarCuentaComponent },
  { path: 'cambiar-contrasena/:token', component: CambiarContrasenaComponent },
  { path: 'activar-token/:email', component: ActivarCuentaComponent },

  //categoria
  { path: 'categoria', component: CategoriaComponent, canActivate: [RolesGuard], data: { expectedRole: ["ROLE_ADMINISTRADOR"] } },

  //reporte cambiar Estado Administrador
  { path: 'reporte-cambiar-estado-administrador', component: ReportecambiarestadoadminstradorComponent, canActivate: [RolesGuard], data: { expectedRole: ["ROLE_ADMINISTRADOR"] } },
  
  //generar reportes
  { path: 'generar-reportes', component: GenerarReporteComponent, canActivate: [RolesGuard], data: { expectedRole: ["ROLE_ADMINISTRADOR"] } },

  //cuenta
  { path: 'cuenta', component: CuentaComponent },

  //reportes
  { path: 'reportes', component: ReportesComponent, canActivate: [RolesGuard], data: { expectedRole: ["ROLE_CLIENTE"] } },

  //reporte cambiar Estado
  { path: 'reporte-cambiar-estado/:idreporteEstado', component: ReportecambiarestadoComponent, canActivate: [RolesGuard], data: { expectedRole: ["ROLE_CLIENTE"] } },

  //comentario
  { path: 'comentarios/:idreporte', component: ComentariosComponent, canActivate: [RolesGuard], data: { expectedRole: ["ROLE_CLIENTE"] } },

  //Ruta Global
  { path: '**', pathMatch: 'full', redirectTo: 'inicio/10' },
  
];
