import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Professor } from '../../models/professor.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private apiUrl = '/api/professors';
  private readonly headers = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.headers = new HttpHeaders().set(
      'x-auth-token',
      this.authService.getJwtToken() || '',
    );
  }

  getProfessors(): Observable<Professor[]> {
    return this.http.get<Professor[]>(this.apiUrl, { headers: this.headers });
  }
}
