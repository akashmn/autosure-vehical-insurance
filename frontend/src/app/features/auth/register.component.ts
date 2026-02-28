import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-body">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>

      <div class="auth-container">
        <div class="auth-card glass">
          <div class="auth-toggle">
            <button routerLink="/login">Login</button>
            <button class="active">Register</button>
            <div class="slider" style="transform: translateX(100%)"></div>
          </div>

          <!-- Role Toggle -->
          <div class="role-toggle">
            <button [class.active]="role === 'ADMIN'" (click)="switchRole('ADMIN')">Admin</button>
            <button [class.active]="role === 'UNDERWRITER'" (click)="switchRole('UNDERWRITER')">Underwriter</button>
          </div>

          <form [formGroup]="form" class="auth-form active-form" (ngSubmit)="onSubmit()">
            <h2>Create Account</h2>

            <!-- Admin registration: id, username, password -->
            <ng-container *ngIf="role === 'ADMIN'">
              <div class="input-group">
                <input type="number" formControlName="adminId" required placeholder=" " />
                <label>Admin ID</label>
              </div>
              <div class="input-group">
                <input type="text" formControlName="username" required placeholder=" " />
                <label>Username</label>
              </div>
            </ng-container>

            <!-- Underwriter registration: name, dob, dateOfJoining, password -->
            <ng-container *ngIf="role === 'UNDERWRITER'">
              <div class="input-group">
                <input type="text" formControlName="name" required placeholder=" " />
                <label>Full Name</label>
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
            </ng-container>

            <div class="input-group">
              <input type="password" formControlName="password" required placeholder=" " />
              <label>Password</label>
            </div>
            <button type="submit" class="btn-primary btn-block" [disabled]="loading">
              {{ loading ? 'Creating...' : 'Register' }}
            </button>
            <p class="error-msg" *ngIf="error">{{ error }}</p>
            <p class="success-msg" *ngIf="success">{{ success }}</p>
            <p class="switch-text">
              Already a member?
              <a routerLink="/login">Log in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-body {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
    }
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      z-index: -1;
    }
    .blob-1 {
      width: 400px;
      height: 400px;
      background: rgba(0, 255, 136, 0.2);
      top: -50px;
      left: -50px;
    }
    .blob-2 {
      width: 300px;
      height: 300px;
      background: rgba(0, 204, 255, 0.2);
      bottom: -50px;
      right: -50px;
    }
    .auth-container {
      width: 100%;
      max-width: 450px;
      padding: 20px;
    }
    .auth-card {
      padding: 40px;
      position: relative;
    }
    .auth-toggle {
      display: flex;
      position: relative;
      background: rgba(0,0,0,0.3);
      border-radius: 30px;
      margin-bottom: 20px;
    }
    .auth-toggle button {
      flex: 1;
      background: none;
      border: none;
      color: var(--text-muted);
      padding: 12px;
      cursor: pointer;
      font-size: 1rem;
      z-index: 2;
      transition: color 0.3s;
    }
    .auth-toggle button.active {
      color: #fff;
      font-weight: 600;
    }
    .slider {
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      border-radius: 30px;
      z-index: 1;
      opacity: 0.8;
      transition: transform 0.3s ease;
    }
    .role-toggle {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      justify-content: center;
    }
    .role-toggle button {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: var(--text-muted);
      padding: 10px;
      cursor: pointer;
      border-radius: 10px;
      font-size: 0.9rem;
      transition: all 0.3s;
    }
    .role-toggle button.active {
      background: rgba(0,255,136,0.15);
      border-color: var(--primary);
      color: var(--primary);
      font-weight: 600;
    }
    .row {
      display: flex;
      gap: 20px;
    }
    .row .input-group {
      flex: 1;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .input-group {
      position: relative;
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
    .input-group input:focus {
      border-bottom-color: var(--primary);
    }
    .static-label {
      top: -15px !important;
      font-size: 0.8rem !important;
      color: var(--primary) !important;
    }
    .btn-block {
      width: 100%;
      margin-top: 10px;
    }
    .switch-text {
      text-align: center;
      margin-top: 15px;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .switch-text a {
      color: var(--primary);
      text-decoration: underline;
    }
    .error-msg {
      color: #ff4444;
      font-size: 0.85rem;
      text-align: center;
      min-height: 20px;
    }
    .success-msg {
      color: #00ff88;
      font-size: 0.85rem;
      text-align: center;
    }
  `]
})
export class RegisterComponent {
  loading = false;
  error = '';
  success = '';
  role: 'ADMIN' | 'UNDERWRITER' = 'UNDERWRITER';

  form = this.fb.group({
    // Admin fields
    adminId: [null as number | null],
    username: [''],
    // Underwriter fields
    name: [''],
    dob: [''],
    dateOfJoining: [''],
    // Shared
    password: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  switchRole(role: 'ADMIN' | 'UNDERWRITER'): void {
    this.role = role;
    this.error = '';
    this.success = '';
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    if (this.role === 'ADMIN') {
      const { adminId, username, password } = this.form.value;
      if (!adminId || !username) {
        this.error = 'Please fill all Admin fields.';
        this.loading = false;
        return;
      }
      this.authService.adminRegister({ id: adminId, username: username!, password: password! }).subscribe({
        next: res => {
          this.loading = false;
          if (res.success) {
            this.success = 'Admin registered successfully! Please Log In.';
            setTimeout(() => this.router.navigate(['/login']), 1500);
          } else {
            this.error = res.message || 'Registration failed.';
          }
        },
        error: err => {
          this.loading = false;
          this.error = err.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      const { name, dob, dateOfJoining, password } = this.form.value;
      if (!name || !dob || !dateOfJoining) {
        this.error = 'Please fill all Underwriter fields.';
        this.loading = false;
        return;
      }
      this.authService.underwriterRegister({ name, dob, dateOfJoining, password }).subscribe({
        next: res => {
          this.loading = false;
          if (res.success) {
            this.success = `Underwriter registered! Your ID is ${res.data?.underwriterId}. Please Log In.`;
            setTimeout(() => this.router.navigate(['/login']), 2500);
          } else {
            this.error = res.message || 'Registration failed.';
          }
        },
        error: err => {
          this.loading = false;
          this.error = err.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}
