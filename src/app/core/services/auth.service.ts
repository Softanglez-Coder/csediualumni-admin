import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthUser, LoginResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/api/auth`;

  currentUser = signal<AuthUser | null>(null);
  isAuthenticated = signal<boolean>(false);
  private googleAuthWindow: Window | null = null;

  constructor(private http: HttpClient, private router: Router) {
    // Check local storage for token/user on init
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUser.set(JSON.parse(user));
      this.isAuthenticated.set(true);
    }

    // Listen for messages from Google OAuth popup
    window.addEventListener('message', this.handleOAuthMessage.bind(this));
  }

  loginWithGoogle(): void {
    const googleAuthUrl = `${this.API_URL}/google`;
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    this.googleAuthWindow = window.open(
      googleAuthUrl,
      'Google Sign In',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no`
    );
  }

  private handleOAuthMessage(event: MessageEvent): void {
    // Verify the origin matches your API
    if (event.origin !== environment.apiUrl) {
      return;
    }

    const data = event.data as LoginResponse;

    if (data.access_token && data.user) {
      this.currentUser.set(data.user);
      this.isAuthenticated.set(true);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (this.googleAuthWindow) {
        this.googleAuthWindow.close();
      }

      this.router.navigate(['/dashboard']);
    }
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user ? user.roles.includes(role) : false;
  }
}
