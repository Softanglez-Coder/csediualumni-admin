import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    joinedDate: string;
}

export interface UserResponse {
    data: User[];
    total: number;
    page: number;
    limit: number;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    getUsers(page: number = 1, limit: number = 10, sort: string = '', filter: string = ''): Observable<User[]> {
        let params = new HttpParams()
            .set('page', page)
            .set('limit', limit);

        if (sort) params = params.set('sort', sort);
        if (filter) params = params.set('filter', filter);

        // Note: The mock interceptor currently returns the full array. 
        // In a real app, the backend would handle pagination.
        // We'll handle client-side pagination in the component for now since the mock is simple,
        // or update the mock interceptor to handle params.
        // For simplicity, let's assume the API returns the array and we slice it here or in component.
        // Actually, let's just return the array and let the component handle it for this mock phase.
        return this.http.get<User[]>('/api/users', { params });
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`/api/users/${id}`);
    }

    updateUser(id: number, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`/api/users/${id}`, user);
    }
}
