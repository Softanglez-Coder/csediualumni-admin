import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <div class="page-container">
      <h1 class="page-title">Dashboard</h1>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <i class="fas fa-users"></i>
          </div>
          <div>
            <h3 class="text-sm font-medium text-[var(--text-secondary)]">Total Users</h3>
            <p class="text-2xl font-bold text-[var(--text-color)] my-1">1,234</p>
            <p class="text-xs text-emerald-500 font-medium">↑ 12% from last month</p>
          </div>
        </div>
        
        <div class="card flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div>
            <h3 class="text-sm font-medium text-[var(--text-secondary)]">Upcoming Events</h3>
            <p class="text-2xl font-bold text-[var(--text-color)] my-1">5</p>
            <p class="text-xs text-[var(--text-secondary)]">Next: Annual Meetup</p>
          </div>
        </div>
        
        <div class="card flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <i class="fas fa-coins"></i>
          </div>
          <div>
            <h3 class="text-sm font-medium text-[var(--text-secondary)]">Total Revenue</h3>
            <p class="text-2xl font-bold text-[var(--text-color)] my-1">$12,500</p>
            <p class="text-xs text-emerald-500 font-medium">↑ 8% from last month</p>
          </div>
        </div>
        
        <div class="card flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <i class="fas fa-clock"></i>
          </div>
          <div>
            <h3 class="text-sm font-medium text-[var(--text-secondary)]">Pending Requests</h3>
            <p class="text-2xl font-bold text-[var(--text-color)] my-1">23</p>
            <p class="text-xs text-red-500 font-medium">Action required</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card min-h-[300px]">
          <h3 class="text-lg font-semibold mb-4 text-[var(--text-color)]">User Growth</h3>
          <div class="h-48 bg-[var(--bg-color)] rounded-lg flex items-center justify-center text-[var(--text-secondary)]">
            [Chart Placeholder]
          </div>
        </div>
        
        <div class="card min-h-[300px]">
          <h3 class="text-lg font-semibold mb-4 text-[var(--text-color)]">Recent Activities</h3>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3 text-sm text-[var(--text-color)]">
              <span class="w-2 h-2 rounded-full bg-[var(--primary-color)]"></span>
              <p><strong class="font-medium">John Doe</strong> registered as a new member</p>
              <span class="ml-auto text-xs text-[var(--text-secondary)]">2 mins ago</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-[var(--text-color)]">
              <span class="w-2 h-2 rounded-full bg-[var(--primary-color)]"></span>
              <p><strong class="font-medium">Annual Meetup</strong> event created</p>
              <span class="ml-auto text-xs text-[var(--text-secondary)]">1 hour ago</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-[var(--text-color)]">
              <span class="w-2 h-2 rounded-full bg-[var(--primary-color)]"></span>
              <p><strong class="font-medium">Sarah Smith</strong> paid membership fee</p>
              <span class="ml-auto text-xs text-[var(--text-secondary)]">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent { }
