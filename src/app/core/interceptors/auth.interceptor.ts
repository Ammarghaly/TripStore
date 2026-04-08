import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Intercept HTTP requests
   * Logic: Only add Authorization header for non-GET requests
   * GET requests remain public (no auth header)
   * POST, PATCH, PUT, DELETE requests require Authorization: Bearer <accessToken>
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add token for non-GET requests as per requirements
    if (request.method !== 'GET') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }
    return next.handle(request);
  }
}
