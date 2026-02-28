import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PolicyService } from '../../core/services/policy.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-create-policy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="admin-container">
      <aside class="sidebar glass">
        <div class="sidebar-header">
          <div class="logo-circle">AS</div>
          <h3>AutoSure</h3>
        </div>

        <!-- Logged-in user info -->
        <div class="user-info" *ngIf="currentUser">
          <div class="user-avatar">{{ currentUser.name?.charAt(0) || 'U' }}</div>
          <div>
            <p class="user-name">{{ currentUser.name }}</p>
            <p class="user-id">ID: {{ currentUser.underwriterId }}</p>
          </div>
        </div>

        <ul class="sidebar-menu">
          <li routerLink="/underwriter">
            <i class="fas fa-th-large"></i> Dashboard
          </li>
          <li class="active">
            <i class="fas fa-file-signature"></i> Create Insurance
          </li>
        </ul>
      </aside>

      <main class="main-content">
        <header>
          <h2>New <span class="gradient-text">Policy</span></h2>
        </header>

        <section class="admin-section">
          <div class="form-container glass extended-form">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="auto-fields glass-inner">
                <div class="auto-field">
                  <span class="auto-label">Policy Number</span>
                  <span class="auto-value">{{ form.value.policyNo }}</span>
                </div>
                <div class="auto-field">
                  <span class="auto-label">Underwriter ID</span>
                  <span class="auto-value">{{ form.value.underWriterId }}</span>
                </div>
              </div>

              <div class="form-grid">
                <div class="input-group">
                  <input type="text" formControlName="customerName" maxlength="50" required placeholder=" " />
                  <label>Customer Name</label>
                </div>
                <div class="input-group">
                  <input type="text" formControlName="phoneNo" placeholder=" " />
                  <label>Phone No</label>
                </div>

                <div class="input-group">
                  <input type="text" formControlName="vehicleNo" maxlength="10" required placeholder=" " />
                  <label>Vehicle No (Max 10)</label>
                </div>
                <div class="input-group">
                  <select formControlName="vehicleType" required class="glass-select">
                    <option value="" disabled>Select Vehicle Type</option>
                    <option value="TwoWheeler">Two Wheeler</option>
                    <option value="FourWheeler">Four Wheeler</option>
                  </select>
                </div>

                <div class="input-group">
                  <select formControlName="type" required class="glass-select">
                    <option value="" disabled>Select Insurance Type</option>
                    <option value="FullCover">Full Cover</option>
                    <option value="ThirdParty">Third Party</option>
                  </select>
                </div>
                <div class="input-group">
                  <input type="number" formControlName="vehicleValue" required placeholder=" " />
                  <label>Vehicle Value (₹)</label>
                </div>

                <div class="input-group">
                  <input type="text" formControlName="engineNo" required placeholder=" " />
                  <label>Engine No</label>
                </div>
                <div class="input-group">
                  <input type="text" formControlName="chassisNo" required placeholder=" " />
                  <label>Chassis No</label>
                </div>

                <div class="input-group">
                  <input type="number" formControlName="ncb" placeholder=" " />
                  <label>NCB (₹) — only for old vehicles</label>
                </div>
                <div class="input-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" formControlName="claimStatus" />
                    Old Vehicle (has prior claims)?
                  </label>
                </div>
              </div>

              <p class="info-msg">
                <i class="fas fa-info-circle"></i>
                Premium & policy dates are auto-calculated by the system.
              </p>

              <div class="form-actions">
                <button type="submit" class="btn-primary" [disabled]="form.invalid || loading">
                  {{ loading ? 'Creating...' : 'Generate Policy' }}
                </button>
              </div>
              <p class="success-msg" *ngIf="success">{{ success }}</p>
              <p class="error-msg" *ngIf="error">{{ error }}</p>
            </form>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .auto-fields {
      display: flex;
      gap: 20px;
      padding: 15px 20px;
      margin-bottom: 25px;
      border-radius: 10px;
      background: rgba(0,255,136,0.05);
      border: 1px solid var(--glass-border);
    }
    .auto-field {
      flex: 1;
    }
    .auto-label {
      color: var(--text-muted);
      font-size: 0.8rem;
      display: block;
    }
    .auto-value {
      color: var(--primary);
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .info-msg {
      color: var(--secondary);
      font-size: 0.85rem;
      margin: 10px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .checkbox-group { display: flex; align-items: center; }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-muted);
      cursor: pointer;
      position: static !important;
    }
    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary);
    }
    .success-msg { color: #00ff88; font-size: 0.85rem; margin-top: 10px; }
    .error-msg { color: #ff4444; font-size: 0.85rem; margin-top: 10px; }

    /* Sidebar styles */
    .admin-container { display: flex; height: calc(100vh - 80px); }
    .sidebar { width: 260px; padding: 30px 20px; border-radius: 0 20px 20px 0; }
    .sidebar-header {
      display: flex; align-items: center; gap: 15px;
      margin-bottom: 20px; padding-bottom: 20px;
      border-bottom: 1px solid var(--glass-border);
    }
    .logo-circle {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border-radius: 50%; color: #000;
      display: flex; align-items: center; justify-content: center; font-weight: bold;
    }
    .user-info {
      display: flex; align-items: center; gap: 12px;
      padding: 15px; margin-bottom: 20px;
      border-radius: 10px;
      background: rgba(0,255,136,0.05);
      border: 1px solid var(--glass-border);
    }
    .user-avatar {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border-radius: 50%; color: #000;
      display: flex; align-items: center; justify-content: center;
      font-weight: bold; font-size: 1rem;
    }
    .user-name { font-weight: 600; font-size: 0.9rem; }
    .user-id { color: var(--text-muted); font-size: 0.8rem; }
    .sidebar-menu { list-style: none; }
    .sidebar-menu li {
      padding: 15px; margin-bottom: 10px; cursor: pointer;
      border-radius: 10px; transition: var(--transition);
      color: var(--text-muted); display: flex; align-items: center; gap: 10px;
    }
    .sidebar-menu li:hover, .sidebar-menu li.active {
      background: rgba(0,255,136,0.1); color: var(--primary);
      border: 1px solid var(--glass-border);
    }
    .main-content { flex: 1; padding: 30px 50px; overflow-y: auto; }
  `]
})
export class CreatePolicyComponent implements OnInit {
  loading = false;
  success = '';
  error = '';
  currentUser: any = null;

  form = this.fb.group({
    policyNo: [0 as number, Validators.required],
    customerName: ['', [Validators.required, Validators.maxLength(50)]],
    underWriterId: [0 as number, Validators.required],
    vehicleNo: ['', [Validators.required, Validators.maxLength(10)]],
    vehicleType: ['', Validators.required],
    type: ['', Validators.required],
    engineNo: ['', Validators.required],
    chassisNo: ['', Validators.required],
    phoneNo: [''],
    vehicleValue: [0, [Validators.required, Validators.min(0)]],
    ncb: [0],
    claimStatus: [false]
  });

  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Auto-fill underwriter ID from logged-in session
    this.currentUser = this.authService.getUser();
    if (this.currentUser?.underwriterId) {
      this.form.patchValue({ underWriterId: this.currentUser.underwriterId });
    }

    // Auto-generate policy number (timestamp-based unique number)
    this.form.patchValue({ policyNo: this.generatePolicyNo() });
  }

  private generatePolicyNo(): number {
    // Generate a 6-digit policy number using timestamp + random
    const ts = Date.now().toString();
    return Number(ts.slice(-5) + Math.floor(Math.random() * 10));
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.success = '';
    this.error = '';

    this.policyService.createPolicy(this.form.value as any).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          const p = res.data;
          this.success = `Policy #${p?.policyNo} created! Premium: ₹${p?.premiumAmount}`;
          setTimeout(() => this.router.navigate(['/underwriter']), 2000);
        } else {
          this.error = res.message || 'Failed to create policy.';
        }
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message || err.message || 'Failed to create policy.';
      }
    });
  }
}
