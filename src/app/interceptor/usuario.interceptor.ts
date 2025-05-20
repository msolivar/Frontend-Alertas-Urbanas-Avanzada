import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../servicios/token.service';

export const usuarioInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService);
  // const isApiUrl = req.url.includes("api/auth");
  // const isAPIPublico = req.url.includes("api/publico");
// || isApiUrl || isAPIPublico
  if(!tokenService.isLogged()){
    return next(req);
  }

  const token = tokenService.getToken();

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(authReq);

  //Hombre medio
};