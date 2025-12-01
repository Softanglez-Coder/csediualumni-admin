import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  `,
  imports: [],
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    console.log('AuthCallbackComponent - constructor called');
    console.log('Current URL:', window.location.href);
  }

  ngOnInit() {
    console.log('AuthCallbackComponent - ngOnInit called');
    this.route.queryParams.subscribe((params) => {
      console.log('Raw queryParams:', params);
      const token = params['token'];
      const userStr = params['user'];

      console.log('Auth callback - received params:', { token: !!token, user: !!userStr });

      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          console.log('Auth callback - parsed user:', user);

          // Store auth data
          this.authService.handleAuthCallback(token, user);

          // Use setTimeout to ensure localStorage is written and auth state is updated
          setTimeout(() => {
            console.log('Auth callback - navigating to dashboard');
            this.router.navigate(['/dashboard']).then(
              (success) => console.log('Navigation successful:', success),
              (error) => console.error('Navigation failed:', error)
            );
          }, 100);
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.router.navigate(['/login']);
        }
      } else {
        console.error('Missing token or user data');
        this.router.navigate(['/login']);
      }
    });
  }
}
