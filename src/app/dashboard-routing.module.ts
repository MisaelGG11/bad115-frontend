import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { HomeComponent } from './views/dashboard/home/home.component';
import { AccessForbiddenComponent } from './views/access-forbidden/access-forbidden.component';
import { ProfileComponent } from './views/dashboard/profile/profile.component';
import { LaborExperienceComponent } from './views/dashboard/laboral-experience/labor-experience.component';
import { CertificationsAchievementsComponent } from './views/dashboard/certifications-achievements/certifications-achievements.component';
import { CatalogManagementComponent } from './views/dashboard/catalog-management/catalog-management.component';
import { PermissionManagementComponent } from './views/dashboard/permission-management/permission-management.component';
import { RoleManagementComponent } from './views/dashboard/role-management/role-management.component';
import { AcademicKnowledgeComponent } from './views/dashboard/academic-knowledge/academic-knowledge.component';
import { UnblockUsersComponent } from './views/dashboard/unblock-users/unblock-users.component';
import { UserManagementComponent } from './views/dashboard/user-management/user-management.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        title: 'Inicio',
        component: HomeComponent,
      },
      {
        path: 'perfil',
        title: 'Perfil',
        component: ProfileComponent,
      },
      {
        path: 'experiencia-laboral',
        title: 'Experiencia Laboral',
        component: LaborExperienceComponent,
      },
      {
        path: 'educacion',
        title: 'Educación',
        component: AcademicKnowledgeComponent,
      },
      {
        path: 'certificaciones-logros',
        title: 'Certificaciones y Logros',
        component: CertificationsAchievementsComponent,
      },
      {
        path: 'habilidades',
        title: 'Habilidades',
        component: AccessForbiddenComponent,
      },
      {
        path: 'usuarios',
        title: 'Gestión de Usuarios',
        component: UserManagementComponent,
      },
      {
        path: 'permisos',
        title: 'Gestión de Permisos',
        component: PermissionManagementComponent,
      },
      {
        path: 'roles',
        title: 'Gestión de Roles',
        component: RoleManagementComponent,
      },
      {
        path: 'desbloqueo-usuarios',
        title: 'Desbloqueo de Usuarios',
        component: UnblockUsersComponent,
      },
      {
        path: 'catalogos',
        title: 'Gestión de Catálogos',
        component: CatalogManagementComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
})
export class DashboardRoutingModule {}
