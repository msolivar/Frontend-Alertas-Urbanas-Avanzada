import { UbicacionMapa } from "./ubicacionMapa";

export class consultarMapaDTO {
    constructor(
        public id: string  = '',
        public nombre: string  = '',
        public descripcion: string  = '',
        public categoria: string  = '',
        public fechaCreacion: string  = '',
        public estado: string  = '',
        public ubicacion: UbicacionMapa = new UbicacionMapa(),
        public conteoImportantes: number  = 0,
        public promedioEstrellas: number  = 0,
        public calificaciones: { [key: string]: number } = {},
        public rutaImagenes: string  = '',
    ) {}
}
