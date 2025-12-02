import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { switchMap, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        authService.login(window.location.pathname);
        return of(false);
      }

      // Check if user has admin access (not guest or member)
      return authService.hasAdminAccess().pipe(
        switchMap((hasAccess) => {
          if (!hasAccess) {
            // User is authenticated but doesn't have admin access
            alert('Access Denied: You do not have permission to access the admin panel.');
            authService.logout();
            return of(false);
          }
          return of(true);
        })
      );
    }),
    catchError(() => {
      // On error, redirect to login
      authService.login(window.location.pathname);
      return of(false);
    })
  );
};
