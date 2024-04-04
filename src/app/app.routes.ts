import { Routes } from '@angular/router';
import { IndexComponent } from './views/index/index.component';
import { LoginComponent } from './views/auth/login/login.component';
import { SignupComponent } from './views/auth/signup/signup.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { HomeComponent } from './views/dashboard/home/home.component';
import { NotFoundComponent } from './views/notfound/notfound.component';
import { AccessForbiddenComponent } from './views/access-forbidden/access-forbidden.component';

export const routes: Routes = [
  // no layout views
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'settings', component: AccessForbiddenComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: 'forbidden', component: AccessForbiddenComponent },
  //route notfound
  { path: '**', component: NotFoundComponent },
];
