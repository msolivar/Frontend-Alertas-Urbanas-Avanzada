import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { CategoriaDTO } from '../../dto/CategoriaDTO';
import { CategoriasService } from '../../servicios/categorias.service';
import { TokenService } from '../../servicios/token.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit {
  //Inicializar Clase
  categoriaDTO = new CategoriaDTO();

  //Lista Categorias 
  categorias: CategoriaDTO[]; 

  //monstrar boton agregar y actualizar
  mostrarBotonAgregar: boolean = true;
  
  terminoBusqueda: string = '';

  categoriaSeleccionada: CategoriaDTO = { 
    id: '', 
    nombre: '', 
    descripcion: '' 
  };

  constructor(private router: Router, 
    private categoriasService: CategoriasService, 
    private tokenService:TokenService){
      this.categoriaDTO = new CategoriaDTO();
      this.categorias = [];
    }

  ngOnInit(): void {
    // No se necesita cargar datos de un servicio
    this.getCategorias();
  }

  // Formulario*
  editarFormulario(categoria: CategoriaDTO): void {
    this.mostrarBotonAgregar = false;
    this.categoriaSeleccionada = { ...categoria };
  }

  //Limpiar Campos
  limpiarCampos(){
    this.categoriaSeleccionada.nombre = ""; 
    this.categoriaSeleccionada.descripcion = "";
  }

  //Crear*
  agregarCategoria(){

    this.categoriaDTO.nombre = this.categoriaSeleccionada.nombre;
    this.categoriaDTO.descripcion = this.categoriaSeleccionada.descripcion;

    delete this.categoriaDTO.id;

    this.categoriasService.crearCategoria(this.categoriaDTO).subscribe({
      next: (data) => {
        console.log('Categoria registrada', JSON.stringify(data));
        
        this.getCategorias();
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

    this.categoriaDTO.nombre = this.categoriaSeleccionada.nombre;
    this.categoriaDTO.descripcion = this.categoriaSeleccionada.descripcion;

    delete this.categoriaDTO.id;

    this.categoriasService.actualizarCategoria(this.categoriaDTO, this.categoriaSeleccionada.id).subscribe({
      next: (data) => {
        console.log('Categoria actualizada', JSON.stringify(data));
        
        this.getCategorias();
        this.limpiarCampos();
        this.mostrarBotonAgregar = true;
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
      },
    });
  }

  //Eliminar*
  eliminarCategoria(id: string | undefined ): void {
    
    console.log(id);
    
    this.categoriasService.eliminarCategoria(id).subscribe({
      next:(data) => {
        console.log("Categoria eliminada", JSON.stringify(data));

        this.getCategorias();
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

  getCategorias(): void {
    this.categoriasService.obtenerCategorias().subscribe({
      next:(data) => {
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

  //Buscador Palabras
  categoriasFiltradas(): CategoriaDTO[] {
    
    if (!this.terminoBusqueda.trim()) {
      return this.categorias;
      
    }
  
    const termino = this.terminoBusqueda.toLowerCase();
    const filtradas = this.categorias.filter(categoria =>
      categoria.nombre.toLowerCase().includes(termino) ||
      categoria.descripcion.toLowerCase().includes(termino)
    );
  
    // Si no hay coincidencias, retornar todas las categorías
    return filtradas.length > 0 ? filtradas : this.categorias;
  }

}
