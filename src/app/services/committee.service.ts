import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CommitteeMember {
  _id?: string;
  userId:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar?: string;
      };
  designationId: string;
  joinedAt: Date;
}

export interface Designation {
  _id: string;
  name: string;
  roles: string[];
}

export interface Committee {
  _id: string;
  name: string;
  year: number;
  isCurrent: boolean;
  designations: Designation[];
  members: CommitteeMember[];
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCommitteeDto {
  name: string;
  year: number;
  description?: string;
  isCurrent?: boolean;
}

export interface UpdateCommitteeDto {
  name?: string;
  year?: number;
  description?: string;
  isCurrent?: boolean;
  isActive?: boolean;
}

export interface CreateDesignationDto {
  name: string;
  roles: string[];
}

export interface AddCommitteeMemberDto {
  email: string;
  designationId: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommitteeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/committees`;

  // Committee CRUD
  createCommittee(data: CreateCommitteeDto): Observable<Committee> {
    return this.http.post<Committee>(this.apiUrl, data);
  }

  getAllCommittees(): Observable<Committee[]> {
    return this.http.get<Committee[]>(this.apiUrl);
  }

  getCurrentCommittee(): Observable<Committee> {
    return this.http.get<Committee>(`${this.apiUrl}/current`);
  }

  getCommittee(id: string): Observable<Committee> {
    return this.http.get<Committee>(`${this.apiUrl}/${id}`);
  }

  updateCommittee(id: string, data: UpdateCommitteeDto): Observable<Committee> {
    return this.http.put<Committee>(`${this.apiUrl}/${id}`, data);
  }

  toggleCurrentCommittee(id: string): Observable<Committee> {
    return this.http.put<Committee>(`${this.apiUrl}/${id}/toggle-current`, {});
  }

  deleteCommittee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Designation Management
  addDesignation(committeeId: string, data: CreateDesignationDto): Observable<Committee> {
    return this.http.post<Committee>(`${this.apiUrl}/${committeeId}/designations`, data);
  }

  updateDesignation(
    committeeId: string,
    designationId: string,
    data: Partial<CreateDesignationDto>,
  ): Observable<Committee> {
    return this.http.put<Committee>(
      `${this.apiUrl}/${committeeId}/designations/${designationId}`,
      data,
    );
  }

  removeDesignation(committeeId: string, designationId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${committeeId}/designations/${designationId}`);
  }

  // Member Management
  addMember(committeeId: string, data: AddCommitteeMemberDto): Observable<Committee> {
    return this.http.post<Committee>(`${this.apiUrl}/${committeeId}/members`, data);
  }

  removeMember(committeeId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${committeeId}/members`, {
      body: { userId },
    });
  }

  // System initialization
  initializeSystemBot(): Observable<any> {
    return this.http.post(`${this.apiUrl}/system/init-bot`, {});
  }
}
