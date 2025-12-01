import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toolbar">
      <div class="toolbar-content">
        <div class="toolbar-left">
          <h1 class="toolbar-title">CSEDI Alumni Admin</h1>
        </div>
        <div class="toolbar-right">
          @if (user()) {
          <div class="user-menu">
            <span class="user-name">{{ user()?.name }}</span>
            <button class="logout-btn" (click)="logout()">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              Logout
            </button>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .toolbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 64px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      }

      .toolbar-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        padding: 0 24px;
      }

      .toolbar-left {
        display: flex;
        align-items: center;
      }

      .toolbar-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        margin: 0;
      }

      .toolbar-right {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .user-menu {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .user-name {
        color: white;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .logout-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      }

      .logout-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .icon {
        width: 18px;
        height: 18px;
      }
    `,
  ],
})
export class ToolbarComponent {
  user = signal<any>(null);

  constructor(private authService: AuthService, private router: Router) {
    this.loadUser();
  }

  private loadUser() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user.set(JSON.parse(userData));
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
