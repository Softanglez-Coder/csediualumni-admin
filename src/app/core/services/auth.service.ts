import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, switchMap, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  userId: string;
  email: string;
  emailVerified: boolean;
  name: string;
  picture: string;
  permissions: string[];
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth0 = inject(Auth0Service);
  private http = inject(HttpClient);

  // Expose Auth0 observables
  isAuthenticated$ = this.auth0.isAuthenticated$;
  isLoading$ = this.auth0.isLoading$;
  user$ = this.auth0.user$;

  /**
   * Login with redirect
   */
  login(returnUrl?: string): void {
    this.auth0.loginWithRedirect({
      appState: { target: returnUrl || window.location.pathname },
    });
  }

  /**
   * Logout
   */
  logout(): void {
    this.auth0.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  /**
   * Get access token
   */
  getAccessToken(): Observable<string> {
    return this.auth0.getAccessTokenSilently();
  }

  /**
   * Get user profile from backend API (creates user in DB if first login)
   */
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/auth/me`);
  }

  /**
   * Get full profile with backend data
   */
  getProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/profile`);
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): Observable<boolean> {
    return this.getUserProfile().pipe(switchMap((profile) => of(profile.roles.includes(role))));
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): Observable<boolean> {
    return this.getUserProfile().pipe(
      switchMap((profile) => of(profile.permissions.includes(permission)))
    );
  }

  /**
   * Check if user has admin access (not guest or member)
   */
  hasAdminAccess(): Observable<boolean> {
    return this.getUserProfile().pipe(
      switchMap((profile) => {
        const roles = profile.roles || [];
        // Block guest and member roles
        const isGuestOrMember = roles.includes('guest') || roles.includes('member');
        return of(!isGuestOrMember && roles.length > 0);
      })
    );
  }
}
