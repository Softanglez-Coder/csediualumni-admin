import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminToolbarComponent } from './core/components/admin-toolbar/admin-toolbar.component';
import { AdminSidebarComponent } from './core/components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AdminToolbarComponent, AdminSidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('csediualumni-admin');
}
