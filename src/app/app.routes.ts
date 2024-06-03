import { Routes } from '@angular/router';
import { IndexComponent } from './views/index/index.component';
import { LoginComponent } from './views/auth/login/login.component';
import { SignupComponent } from './views/auth/signup/signup.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { UnblockUserComponent } from './views/auth/unblock-user/unblock-user.component';
import { AccessForbiddenComponent } from './views/access-forbidden/access-forbidden.component';
import { NotFoundComponent } from './views/notfound/notfound.component';
import { verifyRoleGuard } from './guards/verify-role.guard';

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
    ],
  },
  {
    path: 'dashboard',
    canActivate: [verifyRoleGuard],
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
