import { Ubicacion } from "./Ubicacion";

export class consultarMisReportesDTO {
    constructor(
        public id: string  = '',
        public nombre: string  = '',
        public descripcion: string  = '',
        public categoria: string  = '',
        public fechaCreacion: string  = '',
        public estado: string  = '',
        public ubicacionDTO: Ubicacion = new Ubicacion(),
        public conteoImportantes: number  = 0,
        public promedioEstrellas: number  = 0,
        public calificaciones: { [key: string]: number } = {},
        public rutaImagenes: string  = '',
    ) {}
}
