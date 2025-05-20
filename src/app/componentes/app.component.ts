import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// importar header y footer
import { HeaderComponent } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';
// import { TokenService } from './servicios/token.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProyectoAngularBootstrap';
}