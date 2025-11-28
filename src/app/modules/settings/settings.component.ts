import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService, AppSettings, FeatureFlag } from '../../core/services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-[var(--text-color)] mb-6">Settings</h1>
    
      <div class="flex gap-4 mb-6 border-b border-[var(--border-color)]">
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200"
          [class.border-[var(--primary-color)]]="activeTab() === 'general'"
          [class.text-[var(--primary-color)]]="activeTab() === 'general'"
          [class.border-transparent]="activeTab() !== 'general'"
          [class.text-[var(--text-secondary)]]="activeTab() !== 'general'"
          [class.hover:text-[var(--text-color)]]="activeTab() !== 'general'"
          (click)="activeTab.set('general')"
        >
          General
        </button>
        <button
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200"
          [class.border-[var(--primary-color)]]="activeTab() === 'features'"
          [class.text-[var(--primary-color)]]="activeTab() === 'features'"
          [class.border-transparent]="activeTab() !== 'features'"
          [class.text-[var(--text-secondary)]]="activeTab() !== 'features'"
          [class.hover:text-[var(--text-color)]]="activeTab() !== 'features'"
          (click)="activeTab.set('features')"
        >
          Feature Flags
        </button>
      </div>
    
      @if (activeTab() === 'general') {
        <div class="card p-6">
          <form [formGroup]="settingsForm" (ngSubmit)="saveSettings()">
            <div class="grid gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Site Name</label>
                <input type="text" formControlName="siteName" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Membership Fee</label>
                <input type="number" formControlName="membershipFee" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Currency</label>
                <select formControlName="currency" class="input-field">
                  <option value="BDT">BDT</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div class="flex items-start gap-3">
                <div class="flex items-center h-5">
                  <input id="maintenanceMode" type="checkbox" formControlName="maintenanceMode" class="w-4 h-4 text-[var(--primary-color)] border-[var(--border-color)] rounded focus:ring-[var(--primary-color)]">
                </div>
                <div class="ml-2 text-sm">
                  <label for="maintenanceMode" class="font-medium text-[var(--text-color)]">Maintenance Mode</label>
                  <p class="text-[var(--text-secondary)]">Prevent users from accessing the site</p>
                </div>
              </div>
            </div>
            <div class="flex justify-end pt-6 border-t border-[var(--border-color)]">
              <button type="submit" class="btn btn-primary" [disabled]="settingsForm.invalid || isSaving">
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      }
    
      @if (activeTab() === 'features') {
        <div class="card p-6">
          <div class="flex flex-col divide-y divide-[var(--border-color)]">
            @for (flag of featureFlags(); track flag) {
              <div class="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                <div>
                  <h3 class="text-sm font-semibold text-[var(--text-color)]">{{ flag.name }}</h3>
                  <p class="text-sm text-[var(--text-secondary)]">{{ flag.description }}</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" [checked]="flag.enabled" (change)="toggleFeature(flag, $event)" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary-color)]"></div>
                </label>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class SettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private fb = inject(FormBuilder);

  activeTab = signal<'general' | 'features'>('general');
  featureFlags = signal<FeatureFlag[]>([]);
  isSaving = false;

  settingsForm = this.fb.group({
    siteName: ['', Validators.required],
    membershipFee: [0, Validators.required],
    currency: ['BDT', Validators.required],
    maintenanceMode: [false]
  });

  ngOnInit() {
    this.loadSettings();
    this.loadFeatureFlags();
  }

  loadSettings() {
    this.settingsService.getSettings().subscribe((settings: AppSettings) => {
      this.settingsForm.patchValue(settings);
    });
  }

  loadFeatureFlags() {
    this.settingsService.getFeatureFlags().subscribe((flags: FeatureFlag[]) => {
      this.featureFlags.set(flags);
    });
  }

  saveSettings() {
    if (this.settingsForm.valid) {
      this.isSaving = true;
      this.settingsService.updateSettings(this.settingsForm.value as AppSettings).subscribe({
        next: (settings: AppSettings) => {
          this.isSaving = false;
          // Show toast
        },
        error: () => this.isSaving = false
      });
    }
  }

  toggleFeature(flag: FeatureFlag, event: Event) {
    const enabled = (event.target as HTMLInputElement).checked;
    this.settingsService.updateFeatureFlag(flag.id, enabled).subscribe();
  }
}
