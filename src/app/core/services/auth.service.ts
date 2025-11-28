import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface LoginResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    currentUser = signal<User | null>(null);
    isAuthenticated = signal<boolean>(false);

    constructor(private http: HttpClient, private router: Router) {
        // Check local storage for token/user on init
        const user = localStorage.getItem('user');
        if (user) {
            this.currentUser.set(JSON.parse(user));
            this.isAuthenticated.set(true);
        }
    }

    login(email: string, password: string) {
        return this.http.post<LoginResponse>('/api/auth/login', { email, password }).pipe(
            tap(response => {
                this.currentUser.set(response.user);
                this.isAuthenticated.set(true);
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                this.router.navigate(['/dashboard']);
            })
        );
    }

    logout() {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['/auth/login']);
    }
}
