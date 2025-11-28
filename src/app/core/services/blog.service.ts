import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface BlogPost {
    id: number;
    title: string;
    author: string;
    date: string;
    content: string;
    status: 'published' | 'draft';
    tags: string[];
}

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    constructor(private http: HttpClient) { }

    getPosts(): Observable<BlogPost[]> {
        // Mock data
        const posts: BlogPost[] = [
            {
                id: 1,
                title: 'Welcome to the new Alumni Portal',
                author: 'Admin',
                date: '2023-10-01',
                content: 'We are excited to launch...',
                status: 'published',
                tags: ['announcement', 'general']
            },
            {
                id: 2,
                title: 'Upcoming Reunion Details',
                author: 'Event Committee',
                date: '2023-10-20',
                content: 'Join us for the annual reunion...',
                status: 'draft',
                tags: ['events', 'reunion']
            }
        ];
        return of(posts).pipe(delay(500));
    }

    getPostById(id: number): Observable<BlogPost> {
        return of({
            id,
            title: 'Mock Post Title',
            author: 'Admin',
            date: '2023-10-01',
            content: 'Mock content...',
            status: 'published',
            tags: ['mock']
        } as BlogPost).pipe(delay(500));
    }

    createPost(post: Omit<BlogPost, 'id'>): Observable<BlogPost> {
        return of({ ...post, id: Math.floor(Math.random() * 1000) }).pipe(delay(500));
    }

    updatePost(id: number, post: Partial<BlogPost>): Observable<BlogPost> {
        return of({ id, ...post } as BlogPost).pipe(delay(500));
    }

    deletePost(id: number): Observable<void> {
        return of(void 0).pipe(delay(500));
    }
}
