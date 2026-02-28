import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UnderwriterService } from '../../core/services/underwriter.service';

@Component({
  selector: 'app-add-underwriter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="admin-container">
      <aside class="sidebar glass">
        <div class="sidebar-header">
          <div class="logo-circle">AS</div>
          <h3>AutoSure</h3>
        </div>
        <ul class="sidebar-menu">
          <li routerLink="/admin">
            <i class="fas fa-th-large"></i> Dashboard
          </li>
          <li class="active">
            <i class="fas fa-user-plus"></i> Add Underwriter
          </li>
        </ul>
      </aside>

      <main class="main-content">
        <header>
          <h2>Register <span class="gradient-text">New Underwriter</span></h2>
        </header>

        <section class="admin-section">
          <div class="form-container glass">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="input-group">
                <input type="text" formControlName="name" maxlength="50" required placeholder=" " />
                <label>Full Name (Max 50 chars)</label>
              </div>
              <div class="row">
                <div class="input-group">
                  <input type="date" formControlName="dob" required />
                  <label class="static-label">Date of Birth</label>
                </div>
                <div class="input-group">
                  <input type="date" formControlName="dateOfJoining" required />
                  <label class="static-label">Joining Date</label>
                </div>
              </div>

              <div class="generated-info glass-inner">
                <p><strong>Auto-Generated Password:</strong> <code>{{ generatedPassword }}</code></p>
                <button type="button" class="btn-small" (click)="regeneratePassword()">Regenerate</button>
              </div>
              <p class="info-msg"><i class="fas fa-info-circle"></i> Underwriter ID will be auto-assigned by the system.</p>

              <button type="submit" class="btn-primary" [disabled]="form.invalid || loading">
                {{ loading ? 'Creating...' : 'Create Underwriter' }}
              </button>
              <p class="success-msg" *ngIf="success">{{ success }}</p>
              <p class="error-msg" *ngIf="error">{{ error }}</p>
            </form>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      height: calc(100vh - 80px);
    }
    .sidebar {
      width: 260px;
      padding: 30px 20px;
      border-radius: 0 20px 20px 0;
    }
    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 50px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--glass-border);
    }
    .logo-circle {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border-radius: 50%;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .sidebar-menu { list-style: none; }
    .sidebar-menu li {
      padding: 15px;
      margin-bottom: 10px;
      cursor: pointer;
      border-radius: 10px;
      transition: var(--transition);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .sidebar-menu li:hover,
    .sidebar-menu li.active {
      background: rgba(0, 255, 136, 0.1);
      color: var(--primary);
      border: 1px solid var(--glass-border);
    }
    .main-content {
      flex: 1;
      padding: 30px 50px;
      overflow-y: auto;
    }
    .form-container {
      max-width: 600px;
      padding: 40px;
      margin: 0 auto;
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
    .generated-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      margin-bottom: 15px;
      border-radius: 10px;
      background: rgba(0,255,136,0.05);
      border: 1px solid var(--glass-border);
    }
    .generated-info code {
      color: var(--primary);
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 1px;
    }
    .btn-small {
      background: transparent;
      border: 1px solid var(--primary);
      color: var(--primary);
      padding: 5px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
    }
    .btn-small:hover {
      background: var(--primary);
      color: #000;
    }
    .info-msg {
      color: var(--secondary);
      font-size: 0.85rem;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .success-msg { color: #00ff88; font-size: 0.85rem; margin-top: 10px; }
    .error-msg { color: #ff4444; font-size: 0.85rem; margin-top: 10px; }
  `]
})
export class AddUnderwriterComponent {
  loading = false;
  success = '';
  error = '';
  generatedPassword = '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    dob: ['', Validators.required],
    dateOfJoining: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private underwriterService: UnderwriterService,
    private router: Router
  ) {
    this.regeneratePassword();
  }

  regeneratePassword(): void {
    // Generate a secure random 8-char password
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pw = '';
    for (let i = 0; i < 8; i++) {
      pw += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.generatedPassword = pw;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.success = '';
    this.error = '';

    const payload = {
      ...this.form.value,
      password: this.generatedPassword
    };

    this.underwriterService.createUnderwriter(payload as any).subscribe({
      next: (res: any) => {
        this.loading = false;
        const uwId = res?.data?.underwriterId || '';
        this.success = `Underwriter created! ID: ${uwId} | Password: ${this.generatedPassword}`;
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to create underwriter.';
      }
    });
  }
}
