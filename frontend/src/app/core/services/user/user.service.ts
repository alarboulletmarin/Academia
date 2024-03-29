import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiURL}/users`;
  private readonly headers = new HttpHeaders();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders().set(
      'x-auth-token',
      this.authService.getJwtToken() || ''
    );
  }

  getUser(id: string): Observable<any> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, {
      headers: this.headers,
    });
  }

  getUsers(): Observable<any> {
    return this.http.get<User[]>(`${this.apiUrl}`, {
      headers: this.headers,
    });
  }
}
