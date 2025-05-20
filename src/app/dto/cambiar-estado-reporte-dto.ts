export class CambiarEstadoReporteDTO {
    constructor(
        public idReporte?: string,
        public nuevoEstado: string = '',
        public motivo: string = '',
    ) { }
}
