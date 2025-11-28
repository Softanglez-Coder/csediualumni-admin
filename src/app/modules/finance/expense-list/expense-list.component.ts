import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService, Expense } from '../../../core/services/finance.service';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-[var(--text-color)]">Expenses</h1>
        <button class="btn btn-primary flex items-center gap-2">
          <i class="fas fa-plus"></i> Add Expense
        </button>
      </div>
    
      <div class="card overflow-hidden p-0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-[var(--bg-color)] border-b border-[var(--border-color)]">
              <tr>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Title</th>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Category</th>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Amount</th>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Date</th>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Approved By</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]">
              @for (expense of expenses(); track expense) {
                <tr class="hover:bg-[var(--bg-color)] transition-colors">
                  <td class="p-4 text-[var(--text-color)]">{{ expense.title }}</td>
                  <td class="p-4 text-[var(--text-color)]">{{ expense.category }}</td>
                  <td class="p-4 font-mono font-semibold text-red-500">-\${{ expense.amount }}</td>
                  <td class="p-4 text-[var(--text-color)]">{{ expense.date | date }}</td>
                  <td class="p-4 text-[var(--text-color)]">{{ expense.approvedBy }}</td>
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
export class ExpenseListComponent implements OnInit {
  private financeService = inject(FinanceService);
  expenses = signal<Expense[]>([]);

  ngOnInit() {
    this.financeService.getExpenses().subscribe(data => {
      this.expenses.set(data);
    });
  }
}
