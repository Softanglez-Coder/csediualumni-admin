import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IssuesService } from '../../core/services/issues.service';
import { Issue, IssueStatus } from '../../core/models/issue.model';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private issuesService = inject(IssuesService);
  private cdr = inject(ChangeDetectorRef);

  issue: Issue | null = null;
  isLoading = true;
  isUpdating = false;
  updateForm!: FormGroup;
  showDeleteConfirm = false;

  IssueStatus = IssueStatus;

  ngOnInit() {
    this.updateForm = this.fb.group({
      status: ['', Validators.required],
      notes: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIssue(id);
    }
  }

  loadIssue(id: string) {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.issuesService.getOne(id).subscribe({
      next: (issue) => {
        this.issue = issue;
        this.updateForm.patchValue({
          status: issue.status,
          notes: issue.notes || '',
        });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading issue:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
        this.router.navigate(['/issues']);
      },
    });
  }

  updateStatus() {
    if (this.updateForm.invalid || !this.issue || this.isUpdating) {
      return;
    }

    this.isUpdating = true;
    this.cdr.markForCheck();
    const { status, notes } = this.updateForm.value;

    this.issuesService.updateStatus(this.issue._id, status, notes).subscribe({
      next: (updatedIssue) => {
        this.issue = updatedIssue;
        this.isUpdating = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error updating issue:', error);
        this.isUpdating = false;
        this.cdr.markForCheck();
      },
    });
  }

  deleteIssue() {
    if (!this.issue) return;

    this.issuesService.delete(this.issue._id).subscribe({
      next: () => {
        this.router.navigate(['/issues']);
      },
      error: (error) => {
        console.error('Error deleting issue:', error);
        this.showDeleteConfirm = false;
        this.cdr.markForCheck();
      },
    });
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
