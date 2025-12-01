import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToolbarComponent, SidebarComponent],
  template: `
    <div class="layout">
      <app-toolbar />
      <app-sidebar />
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .layout {
        min-height: 100vh;
        background: #f1f5f9;
      }

      .main-content {
        margin-left: 260px;
        margin-top: 64px;
        padding: 24px;
        min-height: calc(100vh - 64px);
      }

      @media (max-width: 768px) {
        .main-content {
          margin-left: 0;
        }
      }
    `,
  ],
})
export class LayoutComponent {}
