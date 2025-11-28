import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    template: `
    <header class="h-16 bg-[var(--surface-color)] border-b border-[var(--border-color)] flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-40 transition-colors duration-200">
      <div class="flex items-center gap-4 flex-1">
        <div class="relative w-96">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"></i>
          <input 
            type="text" 
            placeholder="Search..." 
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--bg-color)] border-none text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-color)] placeholder-[var(--text-secondary)]"
          >
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button class="btn-icon relative">
          <i class="fas fa-bell text-lg"></i>
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button class="btn-icon" (click)="toggleTheme()">
          <i class="fas" [class.fa-sun]="themeService.theme() === 'light'" [class.fa-moon]="themeService.theme() === 'dark'"></i>
        </button>

        <div class="h-8 w-px bg-[var(--border-color)] mx-2"></div>

        <button class="flex items-center gap-2 hover:bg-[var(--bg-color)] p-2 rounded-lg transition-colors" (click)="logout()">
          <span class="text-sm font-medium text-[var(--text-color)]">Logout</span>
          <i class="fas fa-sign-out-alt text-[var(--text-secondary)]"></i>
        </button>
      </div>
    </header>
  `,
    styles: []
})
export class HeaderComponent {
    themeService = inject(ThemeService);
    private authService = inject(AuthService);

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    logout() {
        this.authService.logout();
    }
}
