import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header class="header">
      <div class="search-bar">
        <!-- Placeholder for global search -->
      </div>
      <div class="actions">
        <button class="btn btn-outline icon-btn" (click)="toggleTheme()">
          {{ themeService.theme() === 'dark' ? '☀️' : '🌙' }}
        </button>
        <div class="profile" (click)="logout()">
          <div class="avatar">
            {{ authService.currentUser()?.name?.charAt(0) }}
          </div>
          <span class="name">{{ authService.currentUser()?.name }}</span>
        </div>
      </div>
    </header>
  `,
    styles: [`
    .header {
      height: 64px;
      background-color: var(--surface-color);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 9;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .icon-btn {
      padding: 0.5rem;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: var(--radius-md);
      &:hover {
        background-color: var(--bg-color);
      }
    }
    .avatar {
      width: 32px;
      height: 32px;
      background-color: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    .name {
      font-weight: 500;
      color: var(--text-color);
    }
  `]
})
export class HeaderComponent {
    themeService = inject(ThemeService);
    authService = inject(AuthService);

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    logout() {
        this.authService.logout();
    }
}
