import { Component } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    template: `
    <aside class="sidebar">
      <div class="logo">
        <h2>CSE Alumni</h2>
      </div>
      <nav class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <span class="icon">📊</span> Dashboard
        </a>
        <a routerLink="/users" routerLinkActive="active">
          <span class="icon">👥</span> Users
        </a>
        <a routerLink="/events" routerLinkActive="active">
          <span class="icon">📅</span> Events
        </a>
        <a routerLink="/blogs" routerLinkActive="active">
          <span class="icon">📝</span> Blogs
        </a>
        <a routerLink="/payments" routerLinkActive="active">
          <span class="icon">💳</span> Payments
        </a>
        <a routerLink="/settings" routerLinkActive="active">
          <span class="icon">⚙️</span> Settings
        </a>
      </nav>
    </aside>
  `,
    styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background-color: var(--surface-color);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10;
    }
    .logo {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      h2 {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary-color);
      }
    }
    .nav-links {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      a {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        text-decoration: none;
        color: var(--text-secondary);
        border-radius: var(--radius-md);
        transition: all 0.2s;
        font-weight: 500;
        
        .icon {
          margin-right: 0.75rem;
        }
        
        &:hover {
          background-color: var(--bg-color);
          color: var(--text-color);
        }
        
        &.active {
          background-color: var(--primary-color);
          color: white;
          .icon {
            filter: brightness(0) invert(1);
          }
        }
      }
    }
  `]
})
export class SidebarComponent { }
