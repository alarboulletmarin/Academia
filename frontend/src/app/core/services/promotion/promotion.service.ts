import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Promotion } from '../../models/promotion.model';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private apiUrl = 'http://localhost:5000/api/promotions';
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

  public getPromotions(): Observable<Promotion[]> {
    return this.http.get<any>(this.apiUrl, { headers: this.headers });
  }
}
