export class CategoriaDTO {
    constructor(
        public id?: string, 
        public nombre: string = '',
        public descripcion: string = '',
    ) { }
}