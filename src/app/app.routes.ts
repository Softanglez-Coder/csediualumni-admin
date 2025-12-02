import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    children: [
      // Add your admin routes here
      // All child routes will be protected by the admin guard
    ],
  },
];
