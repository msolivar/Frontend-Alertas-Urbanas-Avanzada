export class ActualizarClienteDTO {
    constructor(
    public nombre?: string,
    public ciudad: string = '',
    public direccion: string = '',
    public telefono: string = '',
    public email: string = '',
    public passwordActual: string = '',
    public nuevaPassword: string = '',
    ) { }
}