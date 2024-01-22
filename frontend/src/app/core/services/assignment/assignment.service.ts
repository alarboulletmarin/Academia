import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Assignment } from '../../models/assignment.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private apiUrl = 'http://localhost:1000/api/assignments';
  private readonly headers = new HttpHeaders();

  private assignmentsUpdatedSubject = new Subject<void>();
  public assignmentsUpdatedObservable =
    this.assignmentsUpdatedSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders().set(
      'x-auth-token',
      this.authService.getJwtToken() || ''
    );
  }

  getAssignments(params: HttpParams): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      headers: this.headers,
      params: params,
    });
  }

  addAssignment(assignment: Assignment): Observable<any> {
    return this.http
      .post(this.apiUrl, assignment, { headers: this.headers })
      .pipe(
        tap(() => {
          this.assignmentsUpdatedSubject.next();
        })
      );
  }

  updateAssignment(assignment: Assignment): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/${assignment._id}`, assignment, {
        headers: this.headers,
      })
      .pipe(
        tap(() => {
          this.assignmentsUpdatedSubject.next();
        })
      );
  }

  deleteAssignment(assignment: Assignment): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${assignment._id}`, { headers: this.headers })
      .pipe(
        tap(() => {
          this.assignmentsUpdatedSubject.next();
        })
      );
  }

  generateAssignments(num: number): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/generate`,
        { numAssignments: num },
        { headers: this.headers }
      )
      .pipe(
        tap(() => {
          this.assignmentsUpdatedSubject.next();
        })
      );
  }
}
