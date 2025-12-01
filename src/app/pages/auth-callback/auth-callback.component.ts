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
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const userStr = params['user'];

      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          this.authService.handleAuthCallback(token, user);
          this.router.navigate(['/dashboard']);
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
