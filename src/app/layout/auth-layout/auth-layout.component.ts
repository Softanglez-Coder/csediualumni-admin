import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-auth-layout',
    standalone: true,
    imports: [RouterOutlet],
    template: `
    <div class="auth-container">
      <div class="auth-content">
        <div class="brand">
          <h1>CSE DIU Alumni</h1>
          <p>Admin Portal</p>
        </div>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-color);
      padding: 1rem;
    }
    .auth-content {
      width: 100%;
      max-width: 400px;
    }
    .brand {
      text-align: center;
      margin-bottom: 2rem;
      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
      }
      p {
        color: var(--text-secondary);
      }
    }
  `]
})
export class AuthLayoutComponent { }
