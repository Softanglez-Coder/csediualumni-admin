import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommitteeService, Committee, CreateCommitteeDto } from '../../services/committee.service';

@Component({
  selector: 'app-admin-committees',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './committees.component.html',
  styleUrl: './committees.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCommitteesComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly committeeService = inject(CommitteeService);

  protected readonly committees = signal<Committee[]>([]);
  protected readonly loading = signal(false);
  protected readonly creating = signal(false);
  protected readonly showCreateModal = signal(false);

  protected newCommitteeName = '';
  protected newCommitteeYear = new Date().getFullYear();
  protected newCommitteeDescription = '';
  protected newCommitteeIsCurrent = false;

  ngOnInit(): void {
    this.loadCommittees();
  }

  private loadCommittees(): void {
    this.loading.set(true);
    this.committeeService.getAllCommittees().subscribe({
      next: (committees) => {
        this.committees.set(committees);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading committees:', error);
        alert('Failed to load committees');
        this.loading.set(false);
      },
    });
  }

  protected onCreateCommittee(): void {
    if (!this.newCommitteeName || !this.newCommitteeYear) {
      alert('Please fill in all required fields');
      return;
    }

    const dto: CreateCommitteeDto = {
      name: this.newCommitteeName,
      year: this.newCommitteeYear,
      description: this.newCommitteeDescription,
      isCurrent: this.newCommitteeIsCurrent,
    };

    this.creating.set(true);
    this.committeeService.createCommittee(dto).subscribe({
      next: (committee) => {
        this.committees.update((list) => [committee, ...list]);
        this.showCreateModal.set(false);
        this.resetForm();
        this.creating.set(false);
      },
      error: (error) => {
        console.error('Error creating committee:', error);
        alert('Failed to create committee');
        this.creating.set(false);
      },
    });
  }

  protected onToggleCurrent(committee: Committee): void {
    this.committeeService.toggleCurrentCommittee(committee._id).subscribe({
      next: (updated) => {
        this.committees.update((list) =>
          list.map((c) => (c._id === updated._id ? updated : { ...c, isCurrent: false }))
        );
      },
      error: (error) => {
        console.error('Error toggling current committee:', error);
        alert('Failed to toggle current committee');
      },
    });
  }

  protected onViewDetails(committeeId: string): void {
    this.router.navigate(['/committees', committeeId]);
  }

  protected onDeleteCommittee(committee: Committee): void {
    if (!confirm(`Are you sure you want to delete "${committee.name}"?`)) {
      return;
    }

    this.committeeService.deleteCommittee(committee._id).subscribe({
      next: () => {
        this.committees.update((list) => list.filter((c) => c._id !== committee._id));
      },
      error: (error) => {
        console.error('Error deleting committee:', error);
        alert('Failed to delete committee');
      },
    });
  }

  protected onShowCreateModal(): void {
    this.showCreateModal.set(true);
  }

  protected onCloseCreateModal(): void {
    this.showCreateModal.set(false);
    this.resetForm();
  }

  private resetForm(): void {
    this.newCommitteeName = '';
    this.newCommitteeYear = new Date().getFullYear();
    this.newCommitteeDescription = '';
    this.newCommitteeIsCurrent = false;
  }
}
