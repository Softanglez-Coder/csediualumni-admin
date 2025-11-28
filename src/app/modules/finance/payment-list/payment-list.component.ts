import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService, Payment } from '../../../core/services/finance.service';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1 class="text-2xl font-bold text-[var(--text-color)] mb-6">Payments</h1>
    
      <div class="card overflow-hidden p-0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-[var(--bg-color)] border-b border-[var(--border-color)]">
              <tr>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">User</th>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Type</th>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Amount</th>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Date</th>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]">
              @for (payment of payments(); track payment) {
                <tr class="hover:bg-[var(--bg-color)] transition-colors">
                  <td class="p-4 text-[var(--text-color)]">{{ payment.userName }}</td>
                  <td class="p-4 text-[var(--text-color)]">{{ payment.type | titlecase }}</td>
                  <td class="p-4 font-mono font-semibold text-[var(--text-color)]">\${{ payment.amount }}</td>
                  <td class="p-4 text-[var(--text-color)]">{{ payment.date | date }}</td>
                  <td class="p-4">
                    <span class="px-2 py-1 rounded-full text-xs font-bold uppercase" 
                      [ngClass]="{
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': payment.status === 'completed',
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': payment.status === 'pending',
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': payment.status === 'failed'
                      }">
                      {{ payment.status | titlecase }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PaymentListComponent implements OnInit {
  private financeService = inject(FinanceService);
  payments = signal<Payment[]>([]);

  ngOnInit() {
    this.financeService.getPayments().subscribe(data => {
      this.payments.set(data);
    });
  }
}
