import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer>
      <div class="footer-content container">
        <div class="footer-logo">
          <h3>AutoSure</h3>
          <p>Securing your future, digitally.</p>
        </div>
        <div class="copyright">
          <p>&copy; 2024 AutoSure Systems. All Rights Reserved.</p>
        </div>
        <div class="social-icons">
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-linkedin-in"></i></a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      background: #0a0a0a;
      padding: 50px 0;
      border-top: 1px solid var(--glass-border);
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .social-icons a {
      color: var(--text-main);
      font-size: 1.5rem;
      margin-left: 20px;
      transition: 0.3s;
    }
    .social-icons a:hover {
      color: var(--secondary);
      text-shadow: 0 0 10px var(--secondary);
    }
  `]
})
export class FooterComponent {}

