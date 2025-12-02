import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IssuesService } from '../../core/services/issues.service';
import { Issue, IssueStatus, IssueStats } from '../../core/models/issue.model';

@Component({
  selector: 'app-issues-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssuesListComponent implements OnInit {
  private issuesService = inject(IssuesService);
  private cdr = inject(ChangeDetectorRef);

  issues: Issue[] = [];
  filteredIssues: Issue[] = [];
  stats: IssueStats | null = null;
  selectedFilter: IssueStatus | 'all' = 'all';
  isLoading = true;
  searchQuery = '';

  IssueStatus = IssueStatus;

  ngOnInit() {
    this.loadIssues();
    this.loadStats();
  }

  loadIssues() {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.issuesService.getAll().subscribe({
      next: (issues) => {
        this.issues = issues;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading issues:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadStats() {
    this.issuesService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.cdr.markForCheck();
      },
    });
  }

  filterByStatus(status: IssueStatus | 'all') {
    this.selectedFilter = status;
    this.applyFilters();
  }

  onSearchChange(query: string) {
    this.searchQuery = query.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.issues];

    // Status filter
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter((issue) => issue.status === this.selectedFilter);
    }

    // Search filter
    if (this.searchQuery) {
      filtered = filtered.filter(
        (issue) =>
          issue.name.toLowerCase().includes(this.searchQuery) ||
          issue.email.toLowerCase().includes(this.searchQuery) ||
          issue.subject.toLowerCase().includes(this.searchQuery) ||
          issue.message.toLowerCase().includes(this.searchQuery)
      );
    }

    this.filteredIssues = filtered;
    this.cdr.markForCheck();
  }

  getStatusClass(status: IssueStatus): string {
    switch (status) {
      case IssueStatus.OPEN:
        return 'status-open';
      case IssueStatus.IN_PROGRESS:
        return 'status-in-progress';
      case IssueStatus.RESOLVED:
        return 'status-resolved';
      case IssueStatus.WONT_RESOLVE:
        return 'status-wont-resolve';
      default:
        return '';
    }
  }

  getStatusLabel(status: IssueStatus): string {
    switch (status) {
      case IssueStatus.OPEN:
        return 'Open';
      case IssueStatus.IN_PROGRESS:
        return 'In Progress';
      case IssueStatus.RESOLVED:
        return 'Resolved';
      case IssueStatus.WONT_RESOLVE:
        return "Won't Resolve";
      default:
        return status;
    }
  }

  getStatusIcon(status: IssueStatus): string {
    switch (status) {
      case IssueStatus.OPEN:
        return 'fa-circle-exclamation';
      case IssueStatus.IN_PROGRESS:
        return 'fa-spinner';
      case IssueStatus.RESOLVED:
        return 'fa-circle-check';
      case IssueStatus.WONT_RESOLVE:
        return 'fa-circle-xmark';
      default:
        return 'fa-circle';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
