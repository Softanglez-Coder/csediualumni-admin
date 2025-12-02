export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  WONT_RESOLVE = 'wont_resolve',
}

export interface Issue {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: IssueStatus;
  resolvedAt?: Date;
  resolvedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IssueStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  wontResolve: number;
}
