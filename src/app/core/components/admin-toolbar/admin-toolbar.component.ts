import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-toolbar.component.html',
  styleUrls: ['./admin-toolbar.component.scss'],
})
export class AdminToolbarComponent {
  authService = inject(AuthService);

  user$ = this.authService.user$;

  logout() {
    this.authService.logout();
  }
}
