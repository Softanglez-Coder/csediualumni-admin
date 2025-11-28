import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ReportData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string;
        borderColor?: string;
    }[];
}

@Injectable({
    providedIn: 'root'
})
export class ReportingService {
    constructor(private http: HttpClient) { }

    getUserGrowthData(): Observable<ReportData> {
        return of({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'New Users',
                    data: [10, 25, 40, 35, 50, 75],
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderColor: '#4f46e5'
                }
            ]
        }).pipe(delay(500));
    }

    getRevenueData(): Observable<ReportData> {
        return of({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Revenue',
                    data: [5000, 7500, 6000, 9000, 12000, 15000],
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: '#10b981'
                }
            ]
        }).pipe(delay(500));
    }
}
