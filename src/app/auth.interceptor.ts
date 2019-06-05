import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Security } from './common';
import { environment } from '../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _security: Security) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authHeader = `Bearer ${this._security.getToken()}`; // this.authService.getAuthHeader();
    const authReq = req.clone({ headers: req.headers.set('Authorization', authHeader), url: environment.API_URL + '/' + req.url });
    return next.handle(authReq);
  }
}
