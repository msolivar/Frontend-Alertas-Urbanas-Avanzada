export class NotificacionesDTO {
    constructor(
        public notificacion_app: boolean = false,
        public notificacion_email: boolean = true,
    ) { }

    // string = '',
}