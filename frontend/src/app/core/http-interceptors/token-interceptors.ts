// === Import : NPM
import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

// === Import : LOCAL
import {AuthService} from '../services/auth/auth.service';
import {APP_CONSTANTS} from "../../app.constant";

// If no token, do next without setting headers
// Else, TokenInterceptor intercepts all requests and set the new header with Bearer token.
// Furthermore, httpResponse header contains the new token to store.
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {
  }

  /**
   * Interceptor to add authorization token to outgoing HTTP requests and handle token expiration errors.
   * @param req - The outgoing HTTP request.
   * @param next - The next HTTP handler.
   * @returns An observable of the HTTP response events.
   */
  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.currentTokenValue;
    let header = {};
    if (authToken) {
      header = {
        setHeaders: {Authorization: `Bearer ${authToken}`},
      };
    }

    const clone = req.clone(header);
    return next.handle(clone).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const token = event.headers.get(APP_CONSTANTS.hearders.token);
          if (token) {
            this.authService.setToken(token);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          const errorMsg: string = error.error.message || error.error.reason;

          if (
            errorMsg === 'TokenExpired' ||
            !this.authService.isAuthenticated()
          ) {
            // If token is expired or not present, logout the user and redirect to login
            this.authService.logout();
            console.error('Unauthorized access:', errorMsg);
          } else {
            // Handle other 401 reasons
            this.authService.logout();
            console.error('Unauthorized access:', errorMsg);
          }
        }
        return throwError(error);
      })
    );
  }
}
