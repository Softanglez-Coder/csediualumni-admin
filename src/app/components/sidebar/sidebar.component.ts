import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <nav class="nav-menu">
        @for (item of navItems; track item.route) {
        <a
          [routerLink]="item.route"
          routerLinkActive="active"
          class="nav-item"
          [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
        >
          <span class="icon" [innerHTML]="item.icon"></span>
          <span class="label">{{ item.label }}</span>
        </a>
        }
      </nav>
    </div>
  `,
  styles: [
    `
      .sidebar {
        position: fixed;
        top: 64px;
        left: 0;
        bottom: 0;
        width: 260px;
        background: #1e293b;
        box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
        z-index: 900;
        overflow-y: auto;
      }

      .nav-menu {
        padding: 24px 0;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 24px;
        color: #94a3b8;
        text-decoration: none;
        font-size: 0.9375rem;
        font-weight: 500;
        transition: all 0.2s;
        border-left: 3px solid transparent;
      }

      .nav-item:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #e2e8f0;
      }

      .nav-item.active {
        background: rgba(139, 92, 246, 0.1);
        color: #a78bfa;
        border-left-color: #8b5cf6;
      }

      .icon {
        display: flex;
        align-items: center;
        width: 20px;
        height: 20px;
      }

      .icon :deep(svg) {
        width: 100%;
        height: 100%;
        stroke: currentColor;
      }

      .label {
        flex: 1;
      }

      /* Scrollbar styling */
      .sidebar::-webkit-scrollbar {
        width: 6px;
      }

      .sidebar::-webkit-scrollbar-track {
        background: transparent;
      }

      .sidebar::-webkit-scrollbar-thumb {
        background: #475569;
        border-radius: 3px;
      }

      .sidebar::-webkit-scrollbar-thumb:hover {
        background: #64748b;
      }
    `,
  ],
})
export class SidebarComponent {
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>',
    },
    {
      label: 'Committees',
      route: '/committees',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>',
    },
  ];

  constructor(private router: Router) {}
}
