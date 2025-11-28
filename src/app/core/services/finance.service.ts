import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Payment {
    id: number;
    userId: number;
    userName: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    type: 'membership' | 'event' | 'donation';
}

export interface Expense {
    id: number;
    title: string;
    amount: number;
    date: string;
    category: string;
    approvedBy: string;
}

@Injectable({
    providedIn: 'root'
})
export class FinanceService {
    constructor(private http: HttpClient) { }

    // Mock data for now since we didn't add it to MOCK_DB yet
    // In real app, this would come from API
    getPayments(): Observable<Payment[]> {
        const payments: Payment[] = [
            { id: 1, userId: 1, userName: 'John Doe', amount: 500, date: '2023-10-15', status: 'completed', type: 'membership' },
            { id: 2, userId: 2, userName: 'Jane Smith', amount: 1000, date: '2023-10-16', status: 'pending', type: 'event' },
            { id: 3, userId: 3, userName: 'Bob Johnson', amount: 200, date: '2023-10-17', status: 'completed', type: 'donation' },
        ];
        return of(payments).pipe(delay(500));
    }

    getExpenses(): Observable<Expense[]> {
        const expenses: Expense[] = [
            { id: 1, title: 'Server Hosting', amount: 50, date: '2023-10-01', category: 'Infrastructure', approvedBy: 'Admin' },
            { id: 2, title: 'Event Catering', amount: 300, date: '2023-10-12', category: 'Events', approvedBy: 'Admin' },
        ];
        return of(expenses).pipe(delay(500));
    }
}
