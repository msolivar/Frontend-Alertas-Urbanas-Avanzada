export class CambioPasswordDTO {
  constructor(
    public token: string = '',
    public email: string = '',
    public nuevaPassword: string = '',
  ) {}
}
