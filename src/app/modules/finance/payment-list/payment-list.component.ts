import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService, Payment } from '../../../core/services/finance.service';

@Component({
    selector: 'app-payment-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <h1 class="title">Payments</h1>

      <div class="card">
        <table class="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let payment of payments()">
              <td>{{ payment.userName }}</td>
              <td>{{ payment.type | titlecase }}</td>
              <td class="amount">\${{ payment.amount }}</td>
              <td>{{ payment.date | date }}</td>
              <td>
                <span class="status-badge" [ngClass]="payment.status">{{ payment.status | titlecase }}</span>
              </td>
            </tr>
          </tbody>
        </table>
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
    .data-table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
      }
      th {
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 0.875rem;
      }
      td {
        color: var(--text-color);
        font-size: 0.875rem;
      }
    }
    .amount {
      font-family: monospace;
      font-weight: 600;
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      
      &.completed { background-color: #d1fae5; color: #059669; }
      &.pending { background-color: #fef3c7; color: #d97706; }
      &.failed { background-color: #fee2e2; color: #dc2626; }
    }
  `]
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
