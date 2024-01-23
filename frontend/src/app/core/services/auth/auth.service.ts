// === Import : NPM
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

// === Import : LOCAL
import { APP_CONSTANTS } from '../../../app.constant';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly endpoint = APP_CONSTANTS.endpoints.auth;

  // The key used to store the JWT token in the local storage.
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  /**
   * BehaviorSubject that holds the current token value retrieved from local storage.
   * @private
   * @type {BehaviorSubject<string | null>}
   */
  private currentTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(
      JSON.parse(localStorage.getItem(this.JWT_TOKEN) || '""'),
    );
  /**
   * Observable that emits the current authentication token or null if not authenticated.
   * @type {Observable<string | null>}
   */
  public currentToken: Observable<string | null> =
    this.currentTokenSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {}

  /**
   * Returns the current token value from the currentTokenSubject.
   * @returns {string | null} The current token value or null if it doesn't exist.
   */
  public get currentTokenValue(): string | null {
    return this.currentTokenSubject.getValue();
  }

  /**
   * Sets the JWT token in the local storage and updates the current token subject.
   * @param token - The JWT token to be set in the local storage.
   */
  public setToken(token: string) {
    localStorage.setItem(this.JWT_TOKEN, JSON.stringify(token));
    this.currentTokenSubject.next(token);
  }

  /**
   * Returns the current JWT token value.
   * @returns {string} The current JWT token value.
   */
  public getJwtToken(): string | null {
    return this.currentTokenSubject.getValue();
  }

  public tokenCheck() {
    setInterval(
      () => {
        const token = this.getJwtToken();
        if (token) {
          this.removeJwtToken();
          this.redirectToLogin();
        }
      },
      5 * 60 * 1000,
    ); // 5 minutes
  }

  public removeJwtToken() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.currentTokenSubject.next(null);
  }

  /**
   * Checks if the user is authenticated by verifying the presence of a JWT token.
   * @returns {boolean} True if the user is authenticated, false otherwise.
   */
  public isAuthenticated(): boolean {
    return !!this.getJwtToken();
  }

  /**
   * Sends a POST request to the server to sign in the user.
   * @param data The user's sign in data.
   * @returns An observable of the HTTP response.
   */
  public signin(data: any): Observable<any> {
    return this.httpClient
      .post(this.endpoint.login, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Clears the local storage, sets the current token subject to null.
   */
  public logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.currentTokenSubject.next(null);
    this.router.navigate([APP_CONSTANTS.routerLinks.auth]);
  }

  /**
   * Checks if the user has a specific role by verifying the presence of a JWT token and the role in the decoded token.
   * @param role - The role to check for.
   * @returns {boolean} True if the user has the specified role, false otherwise.
   */
  public hasRole(role: string): boolean {
    const token = this.getJwtToken();
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.role.includes(role);
    }
    return false;
  }

  public getToken() {
    const token = this.getJwtToken();
    if (token) {
      return JSON.parse(atob(token.split('.')[1]));
    }
    return;
  }

  public redirectToLogin() {
    this.router.navigate(['/login']);
  }

  public autoLogin() {
    const token = this.getJwtToken();
    if (token) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  public getUserId() {
    const token = this.getJwtToken();
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.id;
    }
    return;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Une erreur côté client ou un problème réseau.
      console.error('Erreur:', error.error.message);
    } else {
      // Le backend a renvoyé un code de réponse d'échec.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`,
      );
    }
    // Retourne un observable avec un message d'erreur pour l'utilisateur.
    return throwError(error.error);
  }
}
