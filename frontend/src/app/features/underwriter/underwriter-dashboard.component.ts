import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PolicyService, Policy } from '../../core/services/policy.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-underwriter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
          <li class="active">
            <i class="fas fa-th-large"></i> Dashboard
          </li>
          <li routerLink="/policy/create">
            <i class="fas fa-file-signature"></i> Create Insurance
          </li>
        </ul>
      </aside>

      <main class="main-content">
        <header>
          <h2>Policy <span class="gradient-text">Management</span></h2>
        </header>

        <section class="admin-section">
          <div class="search-bar-container glass">
            <i class="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by Customer or Vehicle No..."
              [(ngModel)]="search"
              (ngModelChange)="filter()"
            />
          </div>

          <div class="table-container glass">
            <table>
              <thead>
                <tr>
                  <th>Policy No</th>
                  <th>Customer Name</th>
                  <th>Vehicle Type</th>
                  <th>Vehicle No.</th>
                  <th>Premium</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of filtered">
                  <td>{{ p.policyNo }}</td>
                  <td>{{ p.customerName }}</td>
                  <td>{{ p.vehicleType }}</td>
                  <td>{{ p.vehicleNo }}</td>
                  <td>{{ p.premiumAmount | currency:'INR' }}</td>
                  <td>
                    <button class="btn-icon btn-edit" (click)="view(p)">
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="!loading && filtered.length === 0" class="no-result">
              No policies found.
            </div>
            <div *ngIf="loading" class="no-result">
              Loading...
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
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
    header {
      display: flex; justify-content: space-between;
      align-items: center; margin-bottom: 40px;
    }
    .search-bar-container {
      display: flex; align-items: center;
      padding: 15px 25px; margin-bottom: 30px; max-width: 600px;
    }
    .search-bar-container input {
      background: transparent; border: none; color: #fff;
      width: 100%; margin-left: 15px; font-size: 1rem; outline: none;
    }
    .table-container { padding: 20px; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 15px; text-align: left; border-bottom: 1px solid var(--glass-border); }
    th { color: var(--primary); font-weight: 600; }
    .btn-icon {
      border: none; background: transparent; cursor: pointer;
      font-size: 1.1rem; margin-right: 10px; transition: 0.3s;
    }
    .btn-edit { color: var(--secondary); }
    .btn-edit:hover { transform: scale(1.2); }
    .no-result { text-align: center; padding: 20px; }
  `]
})
export class UnderwriterDashboardComponent implements OnInit {
  policies: Policy[] = [];
  filtered: Policy[] = [];
  search = '';
  loading = false;
  currentUser: any = null;

  constructor(
    private policyService: PolicyService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.load();
  }

  load(): void {
    this.loading = true;
    // Only show policies belonging to the logged-in underwriter
    const uwId = this.currentUser?.underwriterId;
    if (!uwId) {
      this.loading = false;
      return;
    }
    this.policyService.getPoliciesByUnderwriter(uwId).subscribe({
      next: policies => {
        this.loading = false;
        this.policies = policies || [];
        this.filter();
      },
      error: () => {
        this.loading = false;
        this.policies = [];
        this.filtered = [];
      }
    });
  }

  filter(): void {
    const q = this.search.toLowerCase();
    this.filtered = this.policies.filter(
      p => p.customerName.toLowerCase().includes(q) || p.vehicleNo.toLowerCase().includes(q)
    );
  }

  view(p: Policy): void {
    if (!p.policyNo) return;
    this.router.navigate(['/policy', p.policyNo]);
  }
}
