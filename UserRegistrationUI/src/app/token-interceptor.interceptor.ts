import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../app/module/user.service';

@Injectable({ providedIn: 'root'})
export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.userService.getToken();
    if (token) {
      const clonedRequest = request.clone({
        headers: request.headers.append('Authorization', `Bearer ${token}`)
      });
      return next.handle(clonedRequest);
    } else {
      return next.handle(request);
    }
  }
}
