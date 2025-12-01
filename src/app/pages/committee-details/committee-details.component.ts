import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CommitteeService,
  Committee,
  Designation,
  CreateDesignationDto,
  AddCommitteeMemberDto,
  CommitteeMember,
} from '../../services/committee.service';

const AVAILABLE_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'reviewer', label: 'Reviewer' },
  { value: 'member', label: 'Member' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'event_manager', label: 'Event Manager' },
  { value: 'system_admin', label: 'System Admin' },
];

interface PopulatedMember extends Omit<CommitteeMember, 'userId'> {
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
}

@Component({
  selector: 'app-committee-details',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './committee-details.component.html',
  styleUrl: './committee-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommitteeDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly committeeService = inject(CommitteeService);

  protected readonly committee = signal<Committee | null>(null);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly showDesignationModal = signal(false);
  protected readonly showMemberModal = signal(false);
  protected readonly showEditModal = signal(false);

  protected readonly availableRoles = AVAILABLE_ROLES;
  private committeeId = '';

  protected newDesignationName = '';
  protected newDesignationRoles: string[] = [];

  protected newMemberEmail = '';
  protected newMemberDesignationId = '';

  protected readonly populatedMembers = computed(() => {
    const comm = this.committee();
    if (!comm) return [];
    return comm.members.filter((m): m is PopulatedMember => typeof m.userId !== 'string');
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.committeeId = params['id'];
      if (this.committeeId) {
        this.loadCommittee();
      }
    });
  }

  private loadCommittee(): void {
    this.loading.set(true);
    this.committeeService.getCommittee(this.committeeId).subscribe({
      next: (committee) => {
        this.committee.set(committee);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading committee:', error);
        alert('Failed to load committee details');
        this.loading.set(false);
      },
    });
  }

  protected onToggleRole(roleValue: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.newDesignationRoles.includes(roleValue)) {
        this.newDesignationRoles = [...this.newDesignationRoles, roleValue];
      }
    } else {
      this.newDesignationRoles = this.newDesignationRoles.filter((r) => r !== roleValue);
    }
  }

  protected onAddDesignation(): void {
    if (!this.newDesignationName || this.newDesignationRoles.length === 0) {
      alert('Please fill in all fields and select at least one role');
      return;
    }

    const dto: CreateDesignationDto = {
      name: this.newDesignationName,
      roles: this.newDesignationRoles,
    };

    this.saving.set(true);
    this.committeeService.addDesignation(this.committeeId, dto).subscribe({
      next: (updated) => {
        this.committee.set(updated);
        this.showDesignationModal.set(false);
        this.resetDesignationForm();
        this.saving.set(false);
      },
      error: (error) => {
        console.error('Error adding designation:', error);
        alert(error.error?.message || 'Failed to add designation');
        this.saving.set(false);
      },
    });
  }

  protected onDeleteDesignation(designation: Designation): void {
    if (!confirm(`Are you sure you want to delete the "${designation.name}" designation?`)) {
      return;
    }

    this.committeeService.removeDesignation(this.committeeId, designation._id).subscribe({
      next: () => {
        this.loadCommittee();
      },
      error: (error) => {
        console.error('Error deleting designation:', error);
        alert(error.error?.message || 'Failed to delete designation');
      },
    });
  }

  protected onAddMember(): void {
    if (!this.newMemberEmail || !this.newMemberDesignationId) {
      alert('Please fill in all fields');
      return;
    }

    const dto: AddCommitteeMemberDto = {
      email: this.newMemberEmail,
      designationId: this.newMemberDesignationId,
    };

    this.saving.set(true);
    this.committeeService.addMember(this.committeeId, dto).subscribe({
      next: (updated) => {
        this.committee.set(updated);
        this.showMemberModal.set(false);
        this.resetMemberForm();
        this.saving.set(false);
      },
      error: (error) => {
        console.error('Error adding member:', error);
        alert(error.error?.message || 'Failed to add member');
        this.saving.set(false);
      },
    });
  }

  protected onRemoveMember(userId: string): void {
    if (!confirm('Are you sure you want to remove this member?')) {
      return;
    }

    this.committeeService.removeMember(this.committeeId, userId).subscribe({
      next: () => {
        this.loadCommittee();
      },
      error: (error) => {
        console.error('Error removing member:', error);
        alert('Failed to remove member');
      },
    });
  }

  protected getDesignationName(designationId: string): string {
    const designation = this.committee()?.designations.find((d) => d._id === designationId);
    return designation?.name || 'Unknown';
  }

  protected getRoleLabel(roleValue: string): string {
    const role = this.availableRoles.find((r) => r.value === roleValue);
    return role?.label || roleValue;
  }

  protected getMemberCountForDesignation(designationId: string): number {
    return this.committee()?.members.filter((m) => m.designationId === designationId).length || 0;
  }

  protected onShowDesignationModal(): void {
    this.showDesignationModal.set(true);
  }

  protected onCloseDesignationModal(): void {
    this.showDesignationModal.set(false);
    this.resetDesignationForm();
  }

  protected onShowMemberModal(): void {
    this.showMemberModal.set(true);
  }

  protected onCloseMemberModal(): void {
    this.showMemberModal.set(false);
    this.resetMemberForm();
  }

  protected onShowEditModal(): void {
    this.showEditModal.set(true);
  }

  protected onCloseEditModal(): void {
    this.showEditModal.set(false);
  }

  private resetDesignationForm(): void {
    this.newDesignationName = '';
    this.newDesignationRoles = [];
  }

  private resetMemberForm(): void {
    this.newMemberEmail = '';
    this.newMemberDesignationId = '';
  }
}
