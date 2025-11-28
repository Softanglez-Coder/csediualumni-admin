import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, SidebarComponent, HeaderComponent],
    template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <app-header></app-header>
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      margin-left: 250px; /* Sidebar width */
      display: flex;
      flex-direction: column;
      background-color: var(--bg-color);
    }
    .content-wrapper {
      padding: 1.5rem;
      flex: 1;
    }
  `]
})
export class MainLayoutComponent { }
