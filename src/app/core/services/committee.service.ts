import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Committee {
    id: number;
    name: string;
    description: string;
    membersCount: number;
    status: 'active' | 'inactive';
    formedDate: string;
}

@Injectable({
    providedIn: 'root'
})
export class CommitteeService {
    constructor(private http: HttpClient) { }

    getCommittees(): Observable<Committee[]> {
        const committees: Committee[] = [
            { id: 1, name: 'Executive Committee 2023', description: 'Main governing body', membersCount: 12, status: 'active', formedDate: '2023-01-01' },
            { id: 2, name: 'Event Management Committee', description: 'Handles all events', membersCount: 8, status: 'active', formedDate: '2023-02-15' },
            { id: 3, name: 'Advisory Board', description: 'Senior alumni advisors', membersCount: 5, status: 'active', formedDate: '2023-01-10' },
        ];
        return of(committees).pipe(delay(500));
    }

    getCommitteeById(id: number): Observable<Committee> {
        return of({
            id,
            name: 'Mock Committee',
            description: 'Mock description',
            membersCount: 5,
            status: 'active',
            formedDate: '2023-01-01'
        } as Committee).pipe(delay(500));
    }

    createCommittee(committee: Omit<Committee, 'id'>): Observable<Committee> {
        return of({ ...committee, id: Math.floor(Math.random() * 1000) }).pipe(delay(500));
    }

    updateCommittee(id: number, committee: Partial<Committee>): Observable<Committee> {
        return of({ id, ...committee } as Committee).pipe(delay(500));
    }

    deleteCommittee(id: number): Observable<void> {
        return of(void 0).pipe(delay(500));
    }
}
