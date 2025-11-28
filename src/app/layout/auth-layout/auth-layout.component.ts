import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-auth-layout',
    standalone: true,
    imports: [RouterOutlet],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-[var(--bg-color)] p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-[var(--primary-color)] mb-2">CSE DIU Alumni</h1>
          <p class="text-[var(--text-secondary)]">Admin Portal</p>
        </div>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
    styles: []
})
export class AuthLayoutComponent { }
