import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PolicyService, Policy } from '../../core/services/policy.service';

@Component({
  selector: 'app-policy-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="details-card glass" *ngIf="policy; else notFound" id="policy-content">
        <button (click)="print()" class="print-btn">Print</button>

        <div class="details-header">
          <div>
            <h1>Policy Certificate</h1>
            <p style="color:var(--text-muted)">AutoSure Insurance Systems</p>
          </div>
          <div class="logo">Auto<span class="gradient-text">Sure</span></div>
        </div>

        <div class="detail-row">
          <div class="detail-item">
            <strong>Policy No</strong>
            <span>{{ policy.policyNo }}</span>
          </div>
          <div class="detail-item">
            <strong>Status</strong>
            <span class="status-badge">{{ policy.claimStatus ? 'Claimed' : 'Active' }}</span>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-item">
            <strong>Customer Name</strong>
            <span>{{ policy.customerName }}</span>
          </div>
          <div class="detail-item">
            <strong>Premium Amount</strong>
            <span>{{ policy.premiumAmount | currency }}</span>
          </div>
        </div>

        <hr style="border: 0; border-top: 1px solid var(--glass-border); margin: 20px 0;">

        <div class="detail-row">
          <div class="detail-item">
            <strong>Vehicle No</strong>
            <span>{{ policy.vehicleNo }}</span>
          </div>
          <div class="detail-item">
            <strong>Vehicle Type</strong>
            <span>{{ policy.vehicleType }}</span>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-item">
            <strong>Engine No</strong>
            <span>{{ policy.engineNo }}</span>
          </div>
          <div class="detail-item">
            <strong>Chassis No</strong>
            <span>{{ policy.chassisNo }}</span>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-item">
            <strong>Coverage Type</strong>
            <span>{{ policy.type }}</span>
          </div>
          <div class="detail-item">
            <strong>Valid From / To</strong>
            <span>{{ policy.fromDate }} → {{ policy.toDate }}</span>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-item">
            <strong>Vehicle Value</strong>
            <span>{{ policy.vehicleValue | currency }}</span>
          </div>
          <div class="detail-item">
            <strong>NCB</strong>
            <span>{{ policy.ncb }}%</span>
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
          <p>Authorized by Underwriter ID: {{ policy.underWriterId }}</p>
          <p>This is a computer generated document.</p>
        </div>
      </div>

      <ng-template #notFound>
        <div *ngIf="!loading" style="text-align:center; margin-top: 80px;">
          <h2 style="color:red;">Policy Not Found</h2>
        </div>
        <div *ngIf="loading" style="text-align:center; margin-top: 80px;">
          <h2>Loading...</h2>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    body { overflow-y: auto; padding: 50px 0; }
    .details-card {
      max-width: 800px;
      margin: 50px auto;
      min-height: 60vh;
      position: relative;
      padding: 30px;
    }
    .details-header {
      border-bottom: 1px solid var(--glass-border);
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .detail-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 15px;
    }
    .detail-item strong {
      color: var(--primary);
      display: block;
      font-size: 0.85rem;
      margin-bottom: 5px;
    }
    .detail-item span {
      font-size: 1.1rem;
      color: #fff;
    }
    .status-badge {
      padding: 5px 15px;
      background: rgba(0,255,136,0.2);
      color: var(--primary);
      border-radius: 20px;
      font-size: 0.9rem;
    }
    .print-btn {
      position: absolute;
      top: 30px;
      right: 30px;
      background: none;
      border: 1px solid var(--text-muted);
      color: var(--text-muted);
      padding: 5px 15px;
      cursor: pointer;
      border-radius: 5px;
    }
    .print-btn:hover {
      background: #fff;
      color: #000;
    }
  `]
})
export class PolicyDetailsComponent implements OnInit {
  policy: Policy | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private policyService: PolicyService
  ) { }

  ngOnInit(): void {
    const policyNo = Number(this.route.snapshot.paramMap.get('id'));
    if (policyNo) {
      this.policyService.getPolicy(policyNo).subscribe({
        next: p => {
          this.loading = false;
          this.policy = p;
        },
        error: () => {
          this.loading = false;
          this.policy = null;
        }
      });
    } else {
      this.loading = false;
    }
  }

  print(): void {
    window.print();
  }
}
