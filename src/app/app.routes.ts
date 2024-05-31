import { Routes } from '@angular/router';
import { IndexComponent } from './views/index/index.component';
import { LoginComponent } from './views/auth/login/login.component';
import { SignupComponent } from './views/auth/signup/signup.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { HomeComponent } from './views/dashboard/home/home.component';
import { NotFoundComponent } from './views/notfound/notfound.component';
import { AccessForbiddenComponent } from './views/access-forbidden/access-forbidden.component';
import { verifyRoleGuard } from './guards/verify-role.guard';
import { UnblockUserComponent } from './views/auth/unblock-user/unblock-user.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { ProfileComponent } from './views/dashboard/profile/profile.component';
import { LaborExperienceComponent } from './views/dashboard/laboral-experience/labor-experience.component';
import { CertificationsAchievementsComponent } from './views/dashboard/certifications-achievements/certifications-achievements.component';
import { CatalogManagementComponent } from './views/dashboard/catalog-management/catalog-management.component';
import { PermissionManagementComponent } from './views/dashboard/permission-management/permission-management.component';
import { RoleManagementComponent } from './views/dashboard/role-management/role-management.component';
import { AcademicKnowledgeComponent } from './views/dashboard/academic-knowledge/academic-knowledge.component';
import { UnblockUsersComponent } from './views/dashboard/unblock-users/unblock-users.component';

export const routes: Routes = [
  // no layout views
  { path: '', component: IndexComponent },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registro', component: SignupComponent },
      { path: 'unblock-user', component: UnblockUserComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: SignupComponent },
  { path: 'unblock-user', component: UnblockUserComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [verifyRoleGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'settings', component: AccessForbiddenComponent },
      { path: 'perfil', component: ProfileComponent },
      { path: 'experiencia-laboral', component: LaborExperienceComponent },
      { path: 'educacion', component: AcademicKnowledgeComponent },
      { path: 'certificaciones-logros', component: CertificationsAchievementsComponent },
      { path: 'habilidades', component: AccessForbiddenComponent },
      { path: 'catalogos', component: CatalogManagementComponent },
      { path: 'permisos', component: PermissionManagementComponent },
      { path: 'roles', component: RoleManagementComponent },
      { path: 'desbloqueo-usuarios', component: UnblockUsersComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: 'forbidden', component: AccessForbiddenComponent },
  //route notfound
  { path: '**', component: NotFoundComponent },
];
