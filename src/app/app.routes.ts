import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminCommitteesComponent } from './pages/committees/committees.component';
import { CommitteeDetailsComponent } from './pages/committee-details/committee-details.component';
import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'committees', component: AdminCommitteesComponent },
      { path: 'committees/:id', component: CommitteeDetailsComponent },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
