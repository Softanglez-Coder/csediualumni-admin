import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminCommitteesComponent } from './pages/committees/committees.component';
import { CommitteeDetailsComponent } from './pages/committee-details/committee-details.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'committees', component: AdminCommitteesComponent, canActivate: [authGuard] },
  { path: 'committees/:id', component: CommitteeDetailsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/dashboard' },
];
