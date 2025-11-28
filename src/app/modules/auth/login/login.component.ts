import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule],
    template: `
    <div class="card">
      <h2 class="text-xl font-semibold mb-6 text-[var(--text-color)]">Sign In</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="email" class="block mb-2 text-sm font-medium text-[var(--text-color)]">Email</label>
          <input 
            id="email" 
            type="email" 
            formControlName="email" 
            placeholder="admin@example.com"
            class="input-field"
            [class.border-red-500]="isFieldInvalid('email')"
          >
          @if (isFieldInvalid('email')) {
            <div class="text-xs text-red-500 mt-1">
              Valid email is required
            </div>
          }
        </div>

        <div class="mb-6">
          <label for="password" class="block mb-2 text-sm font-medium text-[var(--text-color)]">Password</label>
          <input 
            id="password" 
            type="password" 
            formControlName="password" 
            placeholder="••••••••"
            class="input-field"
            [class.border-red-500]="isFieldInvalid('password')"
          >
          @if (isFieldInvalid('password')) {
            <div class="text-xs text-red-500 mt-1">
              Password is required
            </div>
          }
        </div>

        <button type="submit" class="btn btn-primary w-full" [disabled]="loginForm.invalid || isLoading">
          @if (isLoading) {
            <span>Signing in...</span>
          }
          @if (!isLoading) {
            <span>Sign In</span>
          }
        </button>
      </form>
    </div>
  `,
    styles: []
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
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}
