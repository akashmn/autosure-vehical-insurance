import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UnderwriterUser {
  underwriterId: number;
  name: string;
  dob: string;
  dateOfJoining: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly roleKey = 'autosure_role';
  private readonly userKey = 'autosure_user';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  // ─── Admin Login (hardcoded credentials) ───────────────────────
  adminLogin(username: string, password: string): Observable<ApiResponse<any>> {
    if (username === 'admin' && password === 'admin123') {
      const admin = { id: 1, username: 'admin' };
      this.setSession(admin, 'ADMIN');
      return of({ success: true, message: 'Login Successful', data: admin });
    }
    return of({ success: false, message: 'Invalid Admin Credentials', data: null });
  }

  // ─── Underwriter Login (calls backend) ─────────────────────────
  underwriterLogin(underwriterId: number, password: string): Observable<ApiResponse<UnderwriterUser>> {
    return this.http
      .post<ApiResponse<UnderwriterUser>>(`${environment.apiUrl}/underwriter/login`, {
        underwriterId,
        password
      })
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            this.setSession(res.data, 'UNDERWRITER');
          }
        })
      );
  }

  // ─── Session helpers ───────────────────────────────────────────

  logout(): void {
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getUser(): any {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }

  getToken(): string | null {
    return this.isLoggedIn() ? 'session-active' : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.roleKey);
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isUnderwriter(): boolean {
    return this.getRole() === 'UNDERWRITER';
  }

  private setSession(user: any, role: string): void {
    localStorage.setItem(this.roleKey, role);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.isAuthenticatedSubject.next(true);
  }
}
