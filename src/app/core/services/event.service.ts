import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    description?: string;
}

@Injectable({
    providedIn: 'root'
})
export class EventService {
    constructor(private http: HttpClient) { }

    getEvents(): Observable<Event[]> {
        return this.http.get<Event[]>('/api/events');
    }

    getEventById(id: number): Observable<Event> {
        return this.http.get<Event>(`/api/events/${id}`);
    }

    createEvent(event: Omit<Event, 'id'>): Observable<Event> {
        return this.http.post<Event>('/api/events', event);
    }

    updateEvent(id: number, event: Partial<Event>): Observable<Event> {
        return this.http.put<Event>(`/api/events/${id}`, event);
    }

    deleteEvent(id: number): Observable<void> {
        return this.http.delete<void>(`/api/events/${id}`);
    }
}
