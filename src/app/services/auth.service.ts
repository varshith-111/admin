import { Injectable,  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap ,of } from 'rxjs';
import { LoginRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest) {
    // Call the API to log in
    return this.http.post<{ token: string }>('https://thepostnews-aycjeyh6ffbaa5dm.canadacentral-01.azurewebsites.net/api/Admin/login', credentials).pipe(
      tap(response => {
        // Store the token received from the API
        localStorage.setItem('token', response.token);
        this.tokenSubject.next(response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }
}
