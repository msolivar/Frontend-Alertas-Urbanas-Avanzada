import { Injectable,Inject,PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Buffer } from "buffer";
import { isPlatformBrowser } from '@angular/common';
// import { json } from 'stream/consumers';

const TOKEN_KEY = "AuthToken";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private isBrowser: boolean;

  constructor(private router: Router,@Inject(PLATFORM_ID) private platformId: Object)
  {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public setToken(token: string) {
    //console.log("Ingreso a set toke");
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);

  }
  public getToken(): string | null {
    if (this.isBrowser){
    //console.log("ingresó a get token");
    return window.sessionStorage.getItem(TOKEN_KEY);
    }
    else{
      return "";
    }

  }

  public isLogged(): boolean {
    if (this.getToken())
      {
        return true;
      }
      return false;
    }

    public login(token: string) {
       this.setToken(token);
       this.router.navigate(["/"]).then(() => {
        window.location.reload();
      });
    }

    public logout() {
      window.sessionStorage.clear();
      this.router.navigate(["/login"]).then(() => {
        window.location.reload();
      });
    }

    private decodePayload(token: string): any {
      const payload = token!.split(".")[1];
      const payloadDecoded = Buffer.from(payload, 'base64').toString('ascii');
      const values = JSON.parse(payloadDecoded);
      return values;
    }

    public getId(): string {
      const token = this.getToken();
      if (token) {
      return token;
      }
      return "";
    }

    public getEmail(): string {
      const token = this.getToken();
      if (token) {
      const values = this.decodePayload(token);
      return values.email;
      // return values.sub;
      }
      return "";
    }

    public getName(): string {
      const token = this.getToken();
      if (token) {
      const values = this.decodePayload(token);
      return values.nombre;
      }
      return "";
    }

    public getRole(): string {
      const token = this.getToken();
      if (token) {
      const values = this.decodePayload(token);
      return values.rol;
      }
      return "";
    }

    public isLoggedCliente(): boolean {
      if (this.getRole() == "ROLE_CLIENTE")
        {
          return true;
        }
        return false;
    }

    public isLoggedAdmin(): boolean {
      if (this.getRole() == "ROLE_ADMINISTRADOR")
        {
          return true;
        }
        return false;
    }
}