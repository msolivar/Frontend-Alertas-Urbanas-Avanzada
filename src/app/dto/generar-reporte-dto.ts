export class GenerarReporteDTO {
    constructor(
        public categoria: string = '',
        public fechaInicio: string = '',
        public fechaFinal: string = '',
    ) { }
}