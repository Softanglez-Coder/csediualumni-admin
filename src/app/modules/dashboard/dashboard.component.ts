import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard">
      <h1 class="page-title">Dashboard</h1>
      
      <div class="stats-grid">
        <div class="card stat-card">
          <div class="stat-icon users">👥</div>
          <div class="stat-info">
            <h3>Total Users</h3>
            <p class="value">1,234</p>
            <p class="trend up">↑ 12% from last month</p>
          </div>
        </div>
        
        <div class="card stat-card">
          <div class="stat-icon events">📅</div>
          <div class="stat-info">
            <h3>Upcoming Events</h3>
            <p class="value">5</p>
            <p class="trend">Next: Annual Meetup</p>
          </div>
        </div>
        
        <div class="card stat-card">
          <div class="stat-icon revenue">💰</div>
          <div class="stat-info">
            <h3>Total Revenue</h3>
            <p class="value">$12,500</p>
            <p class="trend up">↑ 8% from last month</p>
          </div>
        </div>
        
        <div class="card stat-card">
          <div class="stat-icon pending">⏳</div>
          <div class="stat-info">
            <h3>Pending Requests</h3>
            <p class="value">23</p>
            <p class="trend down">Action required</p>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="card chart-card">
          <h3>User Growth</h3>
          <div class="chart-placeholder">
            <!-- Chart would go here -->
            [Chart Placeholder]
          </div>
        </div>
        <div class="card chart-card">
          <h3>Recent Activities</h3>
          <div class="activity-list">
            <div class="activity-item">
              <span class="dot"></span>
              <p><strong>John Doe</strong> registered as a new member</p>
              <span class="time">2 mins ago</span>
            </div>
            <div class="activity-item">
              <span class="dot"></span>
              <p><strong>Annual Meetup</strong> event created</p>
              <span class="time">1 hour ago</span>
            </div>
            <div class="activity-item">
              <span class="dot"></span>
              <p><strong>Sarah Smith</strong> paid membership fee</p>
              <span class="time">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-title {
      font-size: 1.875rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: var(--text-color);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      
      &.users { background-color: #e0e7ff; color: #4f46e5; }
      &.events { background-color: #d1fae5; color: #10b981; }
      &.revenue { background-color: #fef3c7; color: #f59e0b; }
      &.pending { background-color: #fee2e2; color: #ef4444; }
    }
    .stat-info {
      h3 {
        font-size: 0.875rem;
        color: var(--text-secondary);
        font-weight: 500;
      }
      .value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-color);
        margin: 0.25rem 0;
      }
      .trend {
        font-size: 0.75rem;
        color: var(--text-secondary);
        &.up { color: var(--secondary-color); }
        &.down { color: var(--danger-color); }
      }
    }
    
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }
    .chart-card {
      min-height: 300px;
      h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--text-color);
      }
    }
    .chart-placeholder {
      height: 200px;
      background-color: var(--bg-color);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
    }
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .activity-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      color: var(--text-color);
      
      .dot {
        width: 8px;
        height: 8px;
        background-color: var(--primary-color);
        border-radius: 50%;
      }
      .time {
        margin-left: auto;
        color: var(--text-secondary);
        font-size: 0.75rem;
      }
    }
  `]
})
export class DashboardComponent { }
