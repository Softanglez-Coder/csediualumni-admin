import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'issues',
        pathMatch: 'full',
      },
      {
        path: 'issues',
        loadComponent: () =>
          import('./features/issues-list/issues-list.component').then((m) => m.IssuesListComponent),
      },
      {
        path: 'issues/:id',
        loadComponent: () =>
          import('./features/issue-detail/issue-detail.component').then(
            (m) => m.IssueDetailComponent
          ),
      },
    ],
  },
];
