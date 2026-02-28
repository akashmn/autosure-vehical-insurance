import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnderwriterService, Underwriter } from '../../core/services/underwriter.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditUnderwriterComponent } from './edit-underwriter.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, EditUnderwriterComponent],
  template: `
    <div class="admin-container">
      <aside class="sidebar glass">
        <div class="sidebar-header">
          <div class="logo-circle">AS</div>
          <h3>AutoSure</h3>
        </div>

        <ul class="sidebar-menu">
          <li class="active">
            <i class="fas fa-th-large"></i> Dashboard
          </li>
          <li routerLink="/admin/add">
            <i class="fas fa-user-plus"></i> Add Underwriter
          </li>
        </ul>
      </aside>

      <main class="main-content">
        <header>
          <h2>Admin <span class="gradient-text">Panel</span></h2>
        </header>

        <section class="admin-section">
          <div class="search-bar-container glass">
            <i class="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by Underwriter Name..."
              [(ngModel)]="search"
              (ngModelChange)="filter()"
            />
          </div>

          <div class="table-container glass">
            <table>
              <thead>
                <tr>
                  <th>Underwriter ID</th>
                  <th>Name</th>
                  <th>DOB</th>
                  <th>Date of Joining</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let uw of filtered">
                  <td>{{ uw.underwriterId }}</td>
                  <td>{{ uw.name }}</td>
                  <td>{{ uw.dob }}</td>
                  <td>{{ uw.dateOfJoining }}</td>
                  <td>
                    <button class="btn-icon btn-edit" (click)="edit(uw)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" (click)="delete(uw)">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="!loading && filtered.length === 0" class="no-result">
              No Underwriters found.
            </div>
            <div *ngIf="loading" class="no-result">
              Loading...
            </div>
          </div>

          <app-edit-underwriter
            *ngIf="editing"
            [underwriter]="editing"
            (closed)="editing = null; load()"
          ></app-edit-underwriter>
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
    .sidebar-menu {
      list-style: none;
    }
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
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }
    .search-bar-container {
      display: flex;
      align-items: center;
      padding: 15px 25px;
      margin-bottom: 30px;
      max-width: 600px;
    }
    .search-bar-container input {
      background: transparent;
      border: none;
      color: #fff;
      width: 100%;
      margin-left: 15px;
      font-size: 1rem;
      outline: none;
    }
    .table-container {
      padding: 20px;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid var(--glass-border);
    }
    th {
      color: var(--primary);
      font-weight: 600;
    }
    .btn-icon {
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 1.1rem;
      margin-right: 10px;
      transition: 0.3s;
    }
    .btn-edit { color: var(--secondary); }
    .btn-delete { color: #ff4444; }
    .btn-edit:hover,
    .btn-delete:hover {
      transform: scale(1.2);
    }
    .no-result {
      text-align: center;
      padding: 20px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  underwriters: Underwriter[] = [];
  filtered: Underwriter[] = [];
  search = '';
  loading = false;
  editing: Underwriter | null = null;

  constructor(private underwriterService: UnderwriterService) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.underwriterService.getUnderwriters().subscribe({
      next: res => {
        this.loading = false;
        // Backend returns Underwriter[] directly from /underwriter/all
        this.underwriters = res;
        this.filter();
      },
      error: () => (this.loading = false)
    });
  }

  filter(): void {
    const q = this.search.toLowerCase();
    this.filtered = this.underwriters.filter(
      u => u.name.toLowerCase().includes(q)
    );
  }

  edit(uw: Underwriter): void {
    this.editing = uw;
  }

  delete(uw: Underwriter): void {
    if (!uw.underwriterId) {
      return;
    }
    if (confirm(`Are you sure you want to remove Underwriter ${uw.name}?`)) {
      this.underwriterService.deleteUnderwriter(uw.underwriterId).subscribe(() => this.load());
    }
  }
}
