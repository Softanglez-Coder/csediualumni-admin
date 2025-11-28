import { Component, OnInit, inject, signal } from '@angular/core';
import { ReportingService, ReportData } from '../../core/services/reporting.service';

@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [],
  template: `
    <div class="page-container">
      <h1 class="text-2xl font-bold text-[var(--text-color)] mb-6">Reporting & Analytics</h1>
    
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card p-6 min-h-[400px] flex flex-col">
          <h3 class="text-lg font-semibold text-[var(--text-color)] mb-6">User Growth</h3>
          <div class="flex-1 flex items-end justify-center pb-8 border-b border-[var(--border-color)]">
            <!-- In a real app, use Chart.js or similar. Here we simulate a chart with CSS bars -->
            @if (userGrowth()) {
              <div class="flex items-end gap-4 w-full h-[300px]">
                @for (value of userGrowth()!.datasets[0].data; track value; let i = $index) {
                  <div class="flex-1 flex flex-col items-center justify-end h-full relative group">
                    <div class="w-full max-w-[40px] rounded-t transition-all duration-500 relative cursor-pointer hover:opacity-80" 
                      [style.height.%]="(value / 100) * 100" 
                      [style.background-color]="userGrowth()!.datasets[0].borderColor">
                      <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[var(--text-color)] text-[var(--bg-color)] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {{ value }}
                      </span>
                    </div>
                    <span class="mt-2 text-xs text-[var(--text-secondary)]">{{ userGrowth()!.labels[i] }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
    
        <div class="card p-6 min-h-[400px] flex flex-col">
          <h3 class="text-lg font-semibold text-[var(--text-color)] mb-6">Revenue Trends</h3>
          <div class="flex-1 flex items-end justify-center pb-8 border-b border-[var(--border-color)]">
            @if (revenueData()) {
              <div class="flex items-end gap-4 w-full h-[300px]">
                @for (value of revenueData()!.datasets[0].data; track value; let i = $index) {
                  <div class="flex-1 flex flex-col items-center justify-end h-full relative group">
                    <div class="w-full max-w-[40px] rounded-t transition-all duration-500 relative cursor-pointer hover:opacity-80" 
                      [style.height.%]="(value / 20000) * 100" 
                      [style.background-color]="revenueData()!.datasets[0].borderColor">
                      <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[var(--text-color)] text-[var(--bg-color)] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        \${{ value }}
                      </span>
                    </div>
                    <span class="mt-2 text-xs text-[var(--text-secondary)]">{{ revenueData()!.labels[i] }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
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
