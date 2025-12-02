import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Issue, IssueStats, IssueStatus } from '../models/issue.model';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/issues`;

  getAll(status?: IssueStatus): Observable<Issue[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Issue[]>(this.apiUrl, { params });
  }

  getOne(id: string): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: IssueStatus, notes?: string): Observable<Issue> {
    return this.http.patch<Issue>(`${this.apiUrl}/${id}`, { status, notes });
  }

  delete(id: string): Observable<Issue> {
    return this.http.delete<Issue>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<IssueStats> {
    return this.http.get<IssueStats>(`${this.apiUrl}/stats`);
  }
}
