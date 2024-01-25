import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, Subject, tap } from 'rxjs';
import { Assignment } from '../../models/assignment.model';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private apiUrl = `${environment.apiURL}/assignments`;
  private readonly headers = new HttpHeaders();

  private assignmentsUpdatedSubject = new Subject<void>();
  public assignmentsUpdatedObservable =
    this.assignmentsUpdatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {
    this.headers = new HttpHeaders().set(
      'x-auth-token',
      this.authService.getJwtToken() || '',
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
          this.toastr.success(
            this.translate.instant('toast.success.addAssignment'),
          );
        }),
        catchError((error) => {
          this.toastr.error(
            this.translate.instant('toast.error.addAssignment'),
          );
          throw error;
        }),
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
          this.toastr.success(
            this.translate.instant('toast.success.updateAssignment'),
          );
        }),
        catchError((error) => {
          this.toastr.error(
            this.translate.instant('toast.error.updateAssignment'),
          );
          throw error;
        }),
      );
  }

  deleteAssignment(assignment: Assignment): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${assignment._id}`, { headers: this.headers })
      .pipe(
        tap(() => {
          this.assignmentsUpdatedSubject.next();
          this.toastr.success(
            this.translate.instant('toast.success.deleteAssignment'),
          );
        }),
        catchError((error) => {
          this.toastr.error(
            this.translate.instant('toast.error.deleteAssignment'),
          );
          throw error;
        }),
      );
  }

  generateAssignments(num: number): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/generate`,
        { numAssignments: num },
        { headers: this.headers },
      )
      .pipe(
        tap(() => {
          this.assignmentsUpdatedSubject.next();
          this.toastr.success(
            this.translate.instant('toast.success.generateAssignments'),
          );
        }),
        catchError((error) => {
          this.toastr.error(
            this.translate.instant('toast.error.generateAssignments'),
          );
          throw error;
        }),
      );
  }
}
