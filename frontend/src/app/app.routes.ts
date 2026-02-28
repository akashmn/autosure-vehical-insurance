import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { AddUnderwriterComponent } from './features/admin/add-underwriter.component';
import { UnderwriterDashboardComponent } from './features/underwriter/underwriter-dashboard.component';
import { CreatePolicyComponent } from './features/underwriter/create-policy.component';
import { PolicyDetailsComponent } from './features/underwriter/policy-details.component';
import { adminGuard, underwriterGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'add', component: AddUnderwriterComponent }
    ]
  },
  {
    path: 'underwriter',
    canActivate: [underwriterGuard],
    component: UnderwriterDashboardComponent
  },
  {
    path: 'policy',
    canActivate: [underwriterGuard],
    children: [
      { path: 'create', component: CreatePolicyComponent },
      { path: ':id', component: PolicyDetailsComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
