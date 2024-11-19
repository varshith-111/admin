import { Injectable,  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap ,of } from 'rxjs';
import { LoginRequest } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  public token$ = this.tokenSubject.asObservable();
  private apiUrl = environment.articleURL; 
  
  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest) {
    return this.http.post<{ token: string }>(this.apiUrl+'Admin/login', credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.tokenSubject.next(response.token);
      })
    );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const isTokenExpired = (Date.now() / 1000) > tokenPayload.exp;
      return !isTokenExpired;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }
}
