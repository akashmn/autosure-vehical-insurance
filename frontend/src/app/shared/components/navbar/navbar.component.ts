import { Component, HostBinding, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav [class.scrolled]="scrolled">
      <div class="logo">Auto<span class="gradient-text">Sure</span></div>
      <ul class="nav-links">
        <li><a routerLink="/" fragment="hero">Home</a></li>
        <li><a routerLink="/" fragment="about">About</a></li>
        <li><a routerLink="/" fragment="reviews">Reviews</a></li>
        <li *ngIf="!isLoggedIn"><a routerLink="/login" class="btn-nav">Login</a></li>
        <li *ngIf="isLoggedIn">
          <button class="btn-nav" (click)="logout()">Logout</button>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    nav {
      position: fixed;
      top: 0;
      width: 100%;
      padding: 20px 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 1000;
      transition: var(--transition);
    }
    nav.scrolled {
      background: rgba(15, 15, 15, 0.9);
      backdrop-filter: blur(10px);
      padding: 15px 50px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.5);
    }
    .logo {
      font-size: 1.8rem;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .nav-links {
      list-style: none;
      display: flex;
      gap: 30px;
      align-items: center;
    }
    .nav-links a {
      color: var(--text-main);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition);
    }
    .nav-links a:hover {
      color: var(--primary);
    }
    .btn-nav {
      border: 1px solid var(--primary);
      padding: 8px 20px;
      border-radius: 20px;
      background: transparent;
      color: var(--text-main);
      cursor: pointer;
    }
    .btn-nav:hover {
      background: var(--primary);
      color: #000 !important;
    }
  `]
})
export class NavbarComponent {
  scrolled = false;
  isLoggedIn = false;

  constructor(private authService: AuthService) {
    this.authService.isAuthenticated$.subscribe(v => (this.isLoggedIn = v));
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 50;
  }

  logout(): void {
    this.authService.logout();
  }
}

