import { Ubicacion } from "./Ubicacion";

export class ReporteDTO {
    constructor(
        public titulo: string = '',
        public descripcion: string = '',
        public imagenes: string = '',
        public categoria: string = '',
        public ubicacion: Ubicacion = new Ubicacion(),
        public idUsuario: string = '',
        public horarios: string = '',
        public estado: string = 'PENDIENTE',
    ) { }
}