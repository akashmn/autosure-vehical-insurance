import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Underwriter, UnderwriterService } from '../../core/services/underwriter.service';

@Component({
  selector: 'app-edit-underwriter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content glass">
        <h3>Edit Underwriter <span class="gradient-text">#{{ underwriter.underwriterId }}</span></h3>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="input-group">
            <input type="text" formControlName="name" required placeholder=" " />
            <label>Name</label>
          </div>
          <div class="row">
            <div class="input-group">
              <input type="date" formControlName="dob" required />
              <label class="static-label">DOB</label>
            </div>
            <div class="input-group">
              <input type="date" formControlName="dateOfJoining" required />
              <label class="static-label">Joining Date</label>
            </div>
          </div>

          <!-- Password Reset Section -->
          <div class="password-section">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="resetPassword" [ngModelOptions]="{standalone: true}" />
              Reset Password
            </label>
            <div class="input-group" *ngIf="resetPassword" style="margin-top:10px;">
              <input type="text" formControlName="password" placeholder=" " />
              <label>New Password</label>
              <button type="button" class="btn-gen" (click)="generateNewPassword()">Generate</button>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-nav" (click)="closed.emit()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="form.invalid || loading">
              {{ loading ? 'Updating...' : 'Update' }}
            </button>
          </div>
          <p class="success-msg" *ngIf="successMsg">{{ successMsg }}</p>
          <p class="error-msg" *ngIf="error">{{ error }}</p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      z-index: 2000;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      width: 100%;
      max-width: 520px;
      padding: 30px;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 20px;
    }
    .row { display: flex; gap: 20px; }
    .row .input-group { flex: 1; }
    .input-group {
      position: relative;
      margin-bottom: 20px;
    }
    .input-group input {
      width: 100%;
      background: transparent;
      border: none;
      border-bottom: 1px solid #555;
      padding: 10px 0;
      color: #fff;
      outline: none;
      font-size: 1rem;
      transition: 0.3s;
    }
    .input-group label {
      position: absolute;
      left: 0;
      top: 10px;
      color: var(--text-muted);
      pointer-events: none;
      transition: 0.3s;
    }
    .input-group input:focus ~ label,
    .input-group input:not(:placeholder-shown) ~ label {
      top: -15px;
      font-size: 0.8rem;
      color: var(--primary);
    }
    .static-label {
      top: -15px !important;
      font-size: 0.8rem !important;
      color: var(--primary) !important;
    }
    .password-section {
      padding: 15px;
      border-radius: 10px;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border);
      margin-bottom: 10px;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-muted);
      cursor: pointer;
    }
    .checkbox-label input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--primary);
    }
    .btn-gen {
      position: absolute;
      right: 0;
      top: 8px;
      background: transparent;
      border: 1px solid var(--primary);
      color: var(--primary);
      padding: 3px 10px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.75rem;
    }
    .btn-gen:hover { background: var(--primary); color: #000; }
    .error-msg { color: #ff4444; font-size: 0.85rem; margin-top: 10px; }
    .success-msg { color: #00ff88; font-size: 0.85rem; margin-top: 10px; }
  `]
})
export class EditUnderwriterComponent {
  @Input() underwriter!: Underwriter;
  @Output() closed = new EventEmitter<void>();

  loading = false;
  error = '';
  successMsg = '';
  resetPassword = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    dob: ['', Validators.required],
    dateOfJoining: ['', Validators.required],
    password: ['']
  });

  constructor(
    private fb: FormBuilder,
    private underwriterService: UnderwriterService
  ) { }

  ngOnChanges(): void {
    if (this.underwriter) {
      this.form.patchValue({
        name: this.underwriter.name,
        dob: this.underwriter.dob,
        dateOfJoining: this.underwriter.dateOfJoining,
        password: ''
      });
      this.resetPassword = false;
    }
  }

  generateNewPassword(): void {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pw = '';
    for (let i = 0; i < 8; i++) {
      pw += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.form.patchValue({ password: pw });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.underwriter.underwriterId) return;
    this.loading = true;
    this.error = '';
    this.successMsg = '';

    const payload: any = {
      name: this.form.value.name,
      dob: this.form.value.dob,
      dateOfJoining: this.form.value.dateOfJoining
    };

    // Only include password if admin chose to reset it
    if (this.resetPassword && this.form.value.password) {
      payload.password = this.form.value.password;
    }

    this.underwriterService.updateUnderwriter(this.underwriter.underwriterId, payload).subscribe({
      next: () => {
        this.loading = false;
        if (this.resetPassword && this.form.value.password) {
          this.successMsg = `Updated! New password: ${this.form.value.password}`;
        } else {
          this.closed.emit();
        }
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to update underwriter.';
      }
    });
  }
}
