import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="card">
      <h2 class="title">Sign In</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            type="email" 
            formControlName="email" 
            placeholder="admin@example.com"
            [class.error]="isFieldInvalid('email')"
          >
          <div *ngIf="isFieldInvalid('email')" class="error-msg">
            Valid email is required
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            type="password" 
            formControlName="password" 
            placeholder="••••••••"
            [class.error]="isFieldInvalid('password')"
          >
          <div *ngIf="isFieldInvalid('password')" class="error-msg">
            Password is required
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-full" [disabled]="loginForm.invalid || isLoading">
          <span *ngIf="isLoading">Signing in...</span>
          <span *ngIf="!isLoading">Sign In</span>
        </button>
      </form>
    </div>
  `,
    styles: [`
    .title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: var(--text-color);
    }
    .form-group {
      margin-bottom: 1rem;
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-color);
      }
      input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        background-color: var(--bg-color);
        color: var(--text-color);
        transition: border-color 0.2s;
        
        &:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px var(--primary-color-alpha, rgba(79, 70, 229, 0.1));
        }
        
        &.error {
          border-color: var(--danger-color);
        }
      }
    }
    .error-msg {
      font-size: 0.75rem;
      color: var(--danger-color);
      margin-top: 0.25rem;
    }
    .w-full {
      width: 100%;
    }
  `]
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    isLoading = false;

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    isFieldInvalid(fieldName: string): boolean {
        const field = this.loginForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            const { email, password } = this.loginForm.value;

            this.authService.login(email!, password!).subscribe({
                next: () => {
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Login failed', err);
                    this.isLoading = false;
                    // Show error toast/message
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}
