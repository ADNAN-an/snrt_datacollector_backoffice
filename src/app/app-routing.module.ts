import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { UsersComponent } from './dashboard/user/user.component';
import { StatisticsComponent } from './dashboard/statistics/statistics.component';
import { SettingsComponent } from './dashboard/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      { path: 'users', component: UsersComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'settings', component: SettingsComponent },
    ]
  },
  { path: 'login', component: LoginComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
