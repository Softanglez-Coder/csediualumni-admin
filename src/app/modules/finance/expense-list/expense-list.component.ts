import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService, Expense } from '../../../core/services/finance.service';

@Component({
    selector: 'app-expense-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="title">Expenses</h1>
        <button class="btn btn-primary">
          <span>+</span> Add Expense
        </button>
      </div>
    
      <div class="card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Approved By</th>
            </tr>
          </thead>
          <tbody>
            @for (expense of expenses(); track expense) {
              <tr>
                <td>{{ expense.title }}</td>
                <td>{{ expense.category }}</td>
                <td class="amount text-danger">-\${{ expense.amount }}</td>
                <td>{{ expense.date | date }}</td>
                <td>{{ expense.approvedBy }}</td>
              </tr>
            }
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
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-color);
      }
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
      &.text-danger { color: var(--danger-color); }
    }
  `]
})
export class ExpenseListComponent implements OnInit {
    private financeService = inject(FinanceService);
    expenses = signal<Expense[]>([]);

    ngOnInit() {
        this.financeService.getExpenses().subscribe(data => {
            this.expenses.set(data);
        });
    }
}
