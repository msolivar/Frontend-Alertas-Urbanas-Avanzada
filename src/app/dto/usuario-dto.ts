export class UsuarioDTO {
    constructor(
        public id?: string,
        public nombre: string = '',
        public ciudad: string = '',
        public direccion: string = '',
        public telefono: string = '',
        public email: string = '',
        public estado: string = '',
    ) { }
}