import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Subject } from '../../models/subject.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private apiUrl = `${environment.apiURL}/subjects`;
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

  public getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl, { headers: this.headers });
  }
}
