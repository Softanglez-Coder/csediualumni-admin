import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface AppSettings {
    siteName: string;
    membershipFee: number;
    currency: string;
    maintenanceMode: boolean;
}

export interface FeatureFlag {
    id: string;
    name: string;
    enabled: boolean;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    constructor(private http: HttpClient) { }

    getSettings(): Observable<AppSettings> {
        return of({
            siteName: 'CSE DIU Alumni Association',
            membershipFee: 500,
            currency: 'BDT',
            maintenanceMode: false
        }).pipe(delay(500));
    }

    updateSettings(settings: AppSettings): Observable<AppSettings> {
        return of(settings).pipe(delay(500));
    }

    getFeatureFlags(): Observable<FeatureFlag[]> {
        return of([
            { id: 'new-dashboard', name: 'New Dashboard', enabled: true, description: 'Enable the new dashboard layout' },
            { id: 'dark-mode', name: 'Dark Mode', enabled: true, description: 'Allow users to toggle dark mode' },
            { id: 'beta-features', name: 'Beta Features', enabled: false, description: 'Access to experimental features' }
        ]).pipe(delay(500));
    }

    updateFeatureFlag(id: string, enabled: boolean): Observable<void> {
        return of(void 0).pipe(delay(500));
    }
}
