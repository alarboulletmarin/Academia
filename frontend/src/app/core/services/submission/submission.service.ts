import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Submission } from '../../models/submission.model';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  private apiUrl = '/api/submissions';
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

  getSubmissions(params: HttpParams): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      headers: this.headers,
      params: params,
    });
  }

  updateSubmission(tempSubmission: Submission) {
    return this.http.put(this.apiUrl, tempSubmission, {
      headers: this.headers,
    });
  }
}
