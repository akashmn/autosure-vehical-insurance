import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section id="hero" class="hero-section">
      <div class="hero-content">
        <h1>
          Protect Your Journey <br />
          With <span class="gradient-text">Smart Insurance</span>
        </h1>
        <p>
          Experience the next generation of vehicle insurance management. Real-time
          tracking, instant claims, and paperless renewals.
        </p>
        <a routerLink="/login" class="btn-primary">Get Started</a>
      </div>
      <div class="hero-image">
        <img
          src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000&auto=format&fit=crop"
          alt="Modern Vehicle"
        />
        <div class="floating-badge glass">
          <i class="fas fa-shield-alt"></i> 100% Secure
        </div>
      </div>
    </section>

    <section id="about" class="about-section" #aboutSection>
      <div class="container split-layout">
        <div class="about-text reveal" [class.active]="aboutVisible">
          <h2>Why Choose <span class="gradient-text">AutoSure?</span></h2>
          <p>
            We combine cutting-edge technology with reliable coverage. Manage your fleet
            or personal vehicle data in one centralized dashboard.
          </p>
          <ul class="feature-list">
            <li><i class="fas fa-check-circle"></i> Instant Policy Renewals</li>
            <li><i class="fas fa-bell"></i> Automated Reminders</li>
            <li><i class="fas fa-chart-line"></i> Usage Analytics</li>
          </ul>
        </div>
        <div class="about-image reveal" [class.active]="aboutVisible">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=800&auto=format&fit=crop"
            alt="Digital Dashboard"
          />
        </div>
      </div>
    </section>

    <section id="reviews" class="reviews-section">
      <div class="container">
        <h2>{{ typewriterText }}</h2>
        <div class="carousel-container">
          <button class="carousel-btn prev-btn" (click)="prevSlide()">
            <i class="fas fa-chevron-left"></i>
          </button>

          <div class="carousel-track-container">
            <ul class="carousel-track" [style.transform]="carouselTransform">
              <li
                class="review-card glass"
                *ngFor="let review of reviews"
              >
                <img [src]="review.avatar" alt="User" />
                <h3>{{ review.name }}</h3>
                <div class="stars">{{ review.stars }}</div>
                <p>"{{ review.text }}"</p>
              </li>
            </ul>
          </div>

          <button class="carousel-btn next-btn" (click)="nextSlide()">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10%;
      position: relative;
      overflow: hidden;
    }
    .hero-content {
      flex: 1;
      z-index: 2;
    }
    .hero-content h1 {
      font-size: 3.5rem;
      line-height: 1.2;
      margin-bottom: 20px;
    }
    .hero-content p {
      color: var(--text-muted);
      font-size: 1.1rem;
      margin-bottom: 30px;
      max-width: 500px;
    }
    .hero-image {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      position: relative;
    }
    .hero-image img {
      max-width: 100%;
      border-radius: 20px;
      mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
      animation: float 6s ease-in-out infinite;
    }
    .floating-badge {
      position: absolute;
      bottom: 20%;
      left: 0;
      padding: 15px 25px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--primary);
      font-weight: bold;
      animation: float 5s ease-in-out infinite reverse;
    }
    .about-section {
      padding: 100px 0;
    }
    .split-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      align-items: center;
    }
    .about-text h2 {
      font-size: 2.5rem;
      margin-bottom: 20px;
    }
    .feature-list {
      list-style: none;
      margin-top: 30px;
    }
    .feature-list li {
      margin-bottom: 15px;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .feature-list i {
      color: var(--secondary);
    }
    .about-image img {
      width: 100%;
      border-radius: 15px;
      box-shadow: 0 0 30px rgba(0, 204, 255, 0.1);
    }
    .reviews-section {
      padding: 100px 0;
      text-align: center;
      overflow: hidden;
    }
    .reviews-section h2 {
      font-size: 2.5rem;
      margin-bottom: 50px;
      height: 60px;
    }
    .carousel-container {
      position: relative;
      max-width: 100%;
      padding: 0 50px;
    }
    .carousel-track-container {
      overflow: hidden;
      padding: 20px 0;
    }
    .carousel-track {
      display: flex;
      transition: transform 0.5s ease-in-out;
      list-style: none;
      gap: 20px;
    }
    .review-card {
      flex: 0 0 calc(25% - 15px);
      padding: 30px;
      text-align: left;
      min-height: 250px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.3s;
    }
    .review-card:hover {
      transform: translateY(-10px);
      border-color: var(--primary);
    }
    .review-card img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid var(--primary);
      margin-bottom: 15px;
    }
    .stars {
      color: #ffc107;
      margin: 10px 0;
    }
    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 10;
      transition: 0.3s;
    }
    .prev-btn { left: 0; }
    .next-btn { right: 0; }
    .carousel-btn:hover { background: var(--primary); color: #000; }
    .reveal {
      opacity: 0;
      transform: translateY(50px);
      transition: all 0.8s ease;
    }
    .reveal.active {
      opacity: 1;
      transform: translateY(0);
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
    }
    @media (max-width: 900px) {
      .hero-section {
        flex-direction: column;
        text-align: center;
        padding-top: 100px;
        height: auto;
      }
      .hero-content {
        margin-bottom: 50px;
      }
      .split-layout {
        grid-template-columns: 1fr;
      }
      .review-card {
        flex: 0 0 calc(50% - 15px);
      }
    }
    @media (max-width: 600px) {
      .review-card {
        flex: 0 0 100%;
      }
    }
  `]
})
export class LandingComponent {
  @ViewChild('aboutSection', { static: true }) aboutSection?: ElementRef<HTMLElement>;

  aboutVisible = false;
  typewriterText = '';
  private fullText = 'What Our Customers Say';
  private typeIndex = 0;

  reviews = [
    {
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'James Carter',
      stars: '★★★★★',
      text: 'The dashboard is incredibly intuitive. I renewed my insurance in seconds!'
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      name: 'Sarah Jenkins',
      stars: '★★★★★',
      text: "Best dark mode UI I've seen. Managing 3 cars has never been easier."
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      name: 'Michael Chen',
      stars: '★★★★☆',
      text: 'Great support and the automated reminders saved me from a late fee.'
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      name: 'Emily Ross',
      stars: '★★★★★',
      text: 'Seamless experience on mobile. Highly recommended for fleet owners.'
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      name: 'David Kim',
      stars: '★★★★★',
      text: 'AutoSure revolutionized how I handle my taxi business insurance.'
    }
  ];

  currentIndex = 0;
  carouselTransform = 'translateX(0)';

  constructor() {
    this.startTypewriter();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const rect = this.aboutSection?.nativeElement.getBoundingClientRect();
    if (!rect) return;
    const windowHeight = window.innerHeight;
    this.aboutVisible = rect.top < windowHeight - 150;
  }

  private startTypewriter(): void {
    const interval = setInterval(() => {
      if (this.typeIndex < this.fullText.length) {
        this.typewriterText += this.fullText.charAt(this.typeIndex);
        this.typeIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }

  private getItemsPerView(): number {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    return 4;
  }

  nextSlide(): void {
    const itemsPerView = this.getItemsPerView();
    if (this.currentIndex < this.reviews.length - itemsPerView) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.updateCarousel();
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  private updateCarousel(): void {
    const cardWidth = 280; // approximate width
    const gap = 20;
    const amountToMove = (cardWidth + gap) * this.currentIndex;
    this.carouselTransform = `translateX(-${amountToMove}px)`;
  }
}

