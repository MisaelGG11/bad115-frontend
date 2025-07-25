import { Routes } from '@angular/router';
import { IndexComponent } from './views/index/index.component';
import { LoginComponent } from './views/auth/login/login.component';
import { SignupComponent } from './views/auth/signup/signup.component';
import { CreateCompanyComponent } from './views/auth/create-company/create-company.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { UnblockUserComponent } from './views/auth/unblock-user/unblock-user.component';
import { AccessForbiddenComponent } from './views/access-forbidden/access-forbidden.component';
import { NotFoundComponent } from './views/notfound/notfound.component';
import { verifyActiveSession } from './guards/verify-active-session.guard';

export const routes: Routes = [
  // no layout views
  { path: '', component: IndexComponent },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        title: 'Inicio de sesión',
        component: LoginComponent,
      },
      {
        path: 'registro',
        title: 'Registro',
        component: SignupComponent,
      },
      {
        path: 'unblock-user',
        title: 'Desbloquear usuario',
        component: UnblockUserComponent,
      },
      {
        path: 'registro-empresa',
        title: 'Registro de empresa',
        component: CreateCompanyComponent,
      },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [verifyActiveSession],
    loadChildren: () => import('./dashboard-routing.module').then((m) => m.DashboardRoutingModule),
  },
  {
    path: 'forbidden',
    title: 'Acceso denegado',
    component: AccessForbiddenComponent,
  },
  // route not found
  {
    path: '**',
    title: 'Página no encontrada',
    component: NotFoundComponent,
  },
];
