import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { MOCK_DB } from '../../data/mock-db';

export function mockApiInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    if (req.url.startsWith('/api/')) {
        const { url, method } = req;

        // Simulate network delay
        const delayTime = 500;

        // Handle Login
        if (url.endsWith('/api/auth/login') && method === 'POST') {
            // For now, accept any login
            return of(new HttpResponse({ status: 200, body: { token: 'mock-jwt-token', user: MOCK_DB.users[0] } })).pipe(delay(delayTime));
        }

        // Handle Users
        if (url.endsWith('/api/users') && method === 'GET') {
            return of(new HttpResponse({ status: 200, body: MOCK_DB.users })).pipe(delay(delayTime));
        }

        // Handle Events
        if (url.endsWith('/api/events') && method === 'GET') {
            return of(new HttpResponse({ status: 200, body: MOCK_DB.events })).pipe(delay(delayTime));
        }

        // Default: Pass through if not handled (or return 404 mock)
        // For now, let's just return 404 for unhandled mock routes to avoid confusion
        return of(new HttpResponse({ status: 404, body: { message: 'Mock endpoint not found' } })).pipe(delay(delayTime));
    }

    return next(req);
}
