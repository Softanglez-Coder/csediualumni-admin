import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'users', loadComponent: () => import('./modules/users/user-list/user-list.component').then(m => m.UserListComponent) },
            { path: 'users/:id', loadComponent: () => import('./modules/users/user-detail/user-detail.component').then(m => m.UserDetailComponent) },
            { path: 'membership-requests', loadComponent: () => import('./modules/users/membership-requests/membership-requests.component').then(m => m.MembershipRequestsComponent) },
            { path: 'events', loadComponent: () => import('./modules/events/event-list/event-list.component').then(m => m.EventListComponent) },
            { path: 'events/:id', loadComponent: () => import('./modules/events/event-detail/event-detail.component').then(m => m.EventDetailComponent) },
            { path: 'payments', loadComponent: () => import('./modules/finance/payment-list/payment-list.component').then(m => m.PaymentListComponent) },
            { path: 'expenses', loadComponent: () => import('./modules/finance/expense-list/expense-list.component').then(m => m.ExpenseListComponent) },
            { path: 'blogs', loadComponent: () => import('./modules/blogs/blog-list/blog-list.component').then(m => m.BlogListComponent) },
            { path: 'blogs/:id', loadComponent: () => import('./modules/blogs/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent) },
            { path: 'committees', loadComponent: () => import('./modules/committees/committee-list/committee-list.component').then(m => m.CommitteeListComponent) },
            { path: 'committees/:id', loadComponent: () => import('./modules/committees/committee-detail/committee-detail.component').then(m => m.CommitteeDetailComponent) },
            { path: 'settings', loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent) },
            { path: 'reporting', loadComponent: () => import('./modules/reporting/reporting.component').then(m => m.ReportingComponent) },
            { path: 'documentation', loadComponent: () => import('./modules/documentation/documentation.component').then(m => m.DocumentationComponent) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];
