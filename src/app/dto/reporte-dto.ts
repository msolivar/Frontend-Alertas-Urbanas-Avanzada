import { Ubicacion } from "./Ubicacion";

export class ReporteDTO {
    constructor(
        public titulo: string = '',
        public descripcion: string = '',
        public rutaImagenes: string = '',
        public categoria: string = '',
        public ubicacionDTO: Ubicacion = new Ubicacion(),
        public idUsuario: string = '',
        public fechaCreacion: string = '',
        public estado: string = '',
        
    ) { }
}
