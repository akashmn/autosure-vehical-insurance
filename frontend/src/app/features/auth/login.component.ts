import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-body">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>

      <div class="auth-container">
        <div class="auth-card glass">
          <h2 style="text-align:center; margin-bottom: 10px;">
            Auto<span class="gradient-text">Sure</span>
          </h2>

          <!-- Role Toggle -->
          <div class="role-toggle">
            <button [class.active]="role === 'ADMIN'" (click)="switchRole('ADMIN')">Admin</button>
            <button [class.active]="role === 'UNDERWRITER'" (click)="switchRole('UNDERWRITER')">Underwriter</button>
          </div>

          <form [formGroup]="form" class="auth-form" (ngSubmit)="onSubmit()">
            <h3 style="text-align:center; color:var(--text-muted); margin-bottom:5px;">
              {{ role === 'ADMIN' ? 'Admin Login' : 'Underwriter Login' }}
            </h3>

            <!-- Admin login: username + password -->
            <ng-container *ngIf="role === 'ADMIN'">
              <div class="input-group">
                <input type="text" formControlName="username" required placeholder=" " />
                <label>Username</label>
              </div>
            </ng-container>

            <!-- Underwriter login: underwriterId + password -->
            <ng-container *ngIf="role === 'UNDERWRITER'">
              <div class="input-group">
                <input type="number" formControlName="underwriterId" required placeholder=" " />
                <label>Underwriter ID</label>
              </div>
            </ng-container>

            <div class="input-group">
              <input type="password" formControlName="password" required placeholder=" " />
              <label>Password</label>
            </div>
            <button type="submit" class="btn-primary btn-block" [disabled]="loading">
              {{ loading ? 'Logging in...' : 'Log In' }}
            </button>
            <p class="error-msg" *ngIf="error">{{ error }}</p>
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
      max-width: 420px;
      padding: 20px;
    }
    .auth-card {
      padding: 40px;
      position: relative;
    }
    .role-toggle {
      display: flex;
      gap: 10px;
      margin-bottom: 25px;
      justify-content: center;
    }
    .role-toggle button {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: var(--text-muted);
      padding: 12px;
      cursor: pointer;
      border-radius: 10px;
      font-size: 0.95rem;
      transition: all 0.3s;
    }
    .role-toggle button.active {
      background: rgba(0,255,136,0.15);
      border-color: var(--primary);
      color: var(--primary);
      font-weight: 600;
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
    .btn-block {
      width: 100%;
      margin-top: 10px;
    }
    .error-msg {
      color: #ff4444;
      font-size: 0.85rem;
      text-align: center;
      min-height: 20px;
    }
  `]
})
export class LoginComponent {
  loading = false;
  error = '';
  role: 'ADMIN' | 'UNDERWRITER' = 'ADMIN';

  form = this.fb.group({
    username: [''],
    underwriterId: [null as number | null],
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
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    const password = this.form.value.password!;

    if (this.role === 'ADMIN') {
      const username = this.form.value.username!;
      if (!username) {
        this.error = 'Please enter your username.';
        this.loading = false;
        return;
      }
      this.authService.adminLogin(username, password).subscribe({
        next: res => {
          this.loading = false;
          if (res.success) {
            this.router.navigate(['/admin']);
          } else {
            this.error = res.message || 'Invalid credentials.';
          }
        },
        error: () => {
          this.loading = false;
          this.error = 'Login failed.';
        }
      });
    } else {
      const underwriterId = this.form.value.underwriterId;
      if (!underwriterId) {
        this.error = 'Please enter your Underwriter ID.';
        this.loading = false;
        return;
      }
      this.authService.underwriterLogin(underwriterId, password).subscribe({
        next: res => {
          this.loading = false;
          if (res.success) {
            this.router.navigate(['/underwriter']);
          } else {
            this.error = res.message || 'Invalid credentials.';
          }
        },
        error: err => {
          this.loading = false;
          this.error = err.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }
}
