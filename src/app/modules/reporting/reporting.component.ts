import { Component, OnInit, inject, signal } from '@angular/core';

import { ReportingService, ReportData } from '../../core/services/reporting.service';

@Component({
    selector: 'app-reporting',
    standalone: true,
    imports: [],
    template: `
    <div class="page-container">
      <h1 class="title">Reporting & Analytics</h1>
    
      <div class="charts-grid">
        <div class="card chart-card">
          <h3>User Growth</h3>
          <div class="chart-container">
            <!-- In a real app, use Chart.js or similar. Here we simulate a chart with CSS bars -->
            @if (userGrowth()) {
              <div class="bar-chart">
                @for (value of userGrowth()!.datasets[0].data; track value; let i = $index) {
                  <div class="bar-group">
                    <div class="bar" [style.height.%]="(value / 100) * 100" [style.background-color]="userGrowth()!.datasets[0].borderColor">
                      <span class="tooltip">{{ value }}</span>
                    </div>
                    <span class="label">{{ userGrowth()!.labels[i] }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
    
        <div class="card chart-card">
          <h3>Revenue Trends</h3>
          <div class="chart-container">
            @if (revenueData()) {
              <div class="bar-chart">
                @for (value of revenueData()!.datasets[0].data; track value; let i = $index) {
                  <div class="bar-group">
                    <div class="bar" [style.height.%]="(value / 20000) * 100" [style.background-color]="revenueData()!.datasets[0].borderColor">
                      <span class="tooltip">\${{ value }}</span>
                    </div>
                    <span class="label">{{ revenueData()!.labels[i] }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
    `,
    styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-color);
    }
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }
    .chart-card {
      padding: 1.5rem;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      
      h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: var(--text-color);
      }
    }
    .chart-container {
      flex: 1;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    .bar-chart {
      display: flex;
      align-items: flex-end;
      gap: 1rem;
      height: 300px;
      width: 100%;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border-color);
    }
    .bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: flex-end;
      position: relative;
    }
    .bar {
      width: 40px;
      border-radius: 4px 4px 0 0;
      transition: height 0.5s ease;
      position: relative;
      cursor: pointer;
      
      &:hover .tooltip {
        opacity: 1;
        transform: translateX(-50%) translateY(-10px);
      }
    }
    .tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(0);
      background-color: var(--text-color);
      color: var(--bg-color);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      opacity: 0;
      transition: all 0.2s;
      white-space: nowrap;
      pointer-events: none;
    }
    .label {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
  `]
})
export class ReportingComponent implements OnInit {
    private reportingService = inject(ReportingService);

    userGrowth = signal<ReportData | null>(null);
    revenueData = signal<ReportData | null>(null);

    ngOnInit() {
        this.reportingService.getUserGrowthData().subscribe((data: ReportData) => {
            this.userGrowth.set(data);
        });

        this.reportingService.getRevenueData().subscribe((data: ReportData) => {
            this.revenueData.set(data);
        });
    }
}
