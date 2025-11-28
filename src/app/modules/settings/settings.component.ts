import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService, AppSettings, FeatureFlag } from '../../core/services/settings.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="page-container">
      <h1 class="title">Settings</h1>

      <div class="tabs">
        <button 
          class="tab-btn" 
          [class.active]="activeTab() === 'general'"
          (click)="activeTab.set('general')"
        >
          General
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab() === 'features'"
          (click)="activeTab.set('features')"
        >
          Feature Flags
        </button>
      </div>

      <div class="tab-content" *ngIf="activeTab() === 'general'">
        <div class="card">
          <form [formGroup]="settingsForm" (ngSubmit)="saveSettings()">
            <div class="form-grid">
              <div class="form-group">
                <label>Site Name</label>
                <input type="text" formControlName="siteName">
              </div>
              
              <div class="form-group">
                <label>Membership Fee</label>
                <input type="number" formControlName="membershipFee">
              </div>
              
              <div class="form-group">
                <label>Currency</label>
                <select formControlName="currency">
                  <option value="BDT">BDT</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              
              <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" formControlName="maintenanceMode">
                  Maintenance Mode
                </label>
                <p class="help-text">Prevent users from accessing the site</p>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="settingsForm.invalid || isSaving">
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="tab-content" *ngIf="activeTab() === 'features'">
        <div class="card">
          <div class="feature-list">
            <div class="feature-item" *ngFor="let flag of featureFlags()">
              <div class="feature-info">
                <h3>{{ flag.name }}</h3>
                <p>{{ flag.description }}</p>
              </div>
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  [id]="flag.id" 
                  [checked]="flag.enabled"
                  (change)="toggleFeature(flag, $event)"
                >
                <label [for]="flag.id"></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-color);
      margin-bottom: 1.5rem;
    }
    .tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }
    .tab-btn {
      background: none;
      border: none;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      
      &:hover { color: var(--text-color); }
      &.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }
    }
    .card {
      padding: 2rem;
    }
    .form-grid {
      display: grid;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-secondary);
      }
      
      input[type="text"], input[type="number"], select {
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        background-color: var(--bg-color);
        color: var(--text-color);
        font-size: 1rem;
        
        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }
    }
    .checkbox-group {
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-color);
        font-size: 1rem;
        cursor: pointer;
      }
      .help-text {
        width: 100%;
        margin-left: 1.75rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }
    
    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .feature-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      &:last-child { border-bottom: none; padding-bottom: 0; }
    }
    .feature-info {
      h3 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 0.25rem;
      }
      p {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }
    
    /* Toggle Switch */
    .toggle-switch {
      position: relative;
      width: 50px;
      height: 26px;
      
      input {
        opacity: 0;
        width: 0;
        height: 0;
        
        &:checked + label {
          background-color: var(--primary-color);
        }
        &:checked + label:before {
          transform: translateX(24px);
        }
      }
      
      label {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
        
        &:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
      }
    }
  `]
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
