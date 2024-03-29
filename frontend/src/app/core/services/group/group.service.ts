import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from '../../models/group.model';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = `${environment.apiURL}/groups`;
  private readonly headers = new HttpHeaders();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders().set(
      'x-auth-token',
      this.authService.getJwtToken() || ''
    );
  }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl, { headers: this.headers });
  }
}
