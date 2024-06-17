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
import { verifyPermissionGuard } from './guards/verify-permission.guard';
import { PERMISSIONS } from './utils/constants.utils';
import { ProfileCompanyComponent } from './views/dashboard/profile-company/profile-company.component';
import { RecruiterManagementComponent } from './views/dashboard/recruiter-management/recruiter-management.component';
import { CandidateProfileComponent } from './views/dashboard/candidate-profile/candidate-profile.component';
import { JobPositionManagementComponent } from './views/dashboard/job-position-management/job-position-management.component';
import { CreateJobPositionComponent } from './views/dashboard/job-position-management/components/create-job-position/create-job-position.component';
import { VisualizeJobPositionComponent } from './views/dashboard/job-position-management/components/visualize-job-position/visualize-job-position.component';
import { SkillsAchievementsComponent } from './views/dashboard/skills-achievements/skills-achievements.component';
import { RedTalentHubComponent } from './views/dashboard/red-talent-hub/red-talent-hub.component';
import { getCompanyLocalStorage } from './utils/local-storage.utils';
import { JobApplicationManagementComponent } from './views/dashboard/job-application-management/job-application-management.component';

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
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.READ_CANDIDATE },
      },
      {
        path: 'red-talenthub/perfil-usuario/:candidateId',
        title: 'Perfil de usuario',
        component: CandidateProfileComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.READ_CANDIDATE },
      },
      {
        path: 'experiencia-laboral',
        title: 'Experiencia Laboral',
        component: LaborExperienceComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.READ_CANDIDATE },
      },
      {
        path: 'educacion',
        title: 'Educación',
        component: AcademicKnowledgeComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.READ_CANDIDATE },
      },
      {
        path: 'certificaciones-logros',
        title: 'Certificaciones y Logros',
        component: CertificationsAchievementsComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.READ_CANDIDATE },
      },
      {
        path: 'habilidades',
        title: 'Habilidades',
        component: SkillsAchievementsComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.READ_CANDIDATE },
      },
      {
        path: 'usuarios',
        title: 'Gestión de Usuarios',
        component: UserManagementComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.MANAGE_USER },
      },
      {
        path: 'permisos',
        title: 'Gestión de Permisos',
        component: PermissionManagementComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.MANAGE_PERMISSION },
      },
      {
        path: 'roles',
        title: 'Gestión de Roles',
        component: RoleManagementComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.MANAGE_ROLE },
      },
      {
        path: 'desbloqueo-usuarios',
        title: 'Desbloqueo de Usuarios',
        component: UnblockUsersComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.MANAGE_USER },
      },
      {
        path: 'catalogos',
        title: 'Gestión de Catálogos',
        component: CatalogManagementComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.MANAGE_CATALOG },
      },
      {
        path: 'empresas',
        title: 'Gestión de Empresas',
        component: AccessForbiddenComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.MANAGE_COMPANY },
      },
      {
        path: 'perfil-empresa',
        title: 'Perfil de Empresa',
        component: ProfileCompanyComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.READ_COMPANY },
      },
      {
        path: 'reclutadores-empresa',
        title: 'Gestión de Reclutadores de Empresa',
        component: RecruiterManagementComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.UPDATE_COMPANY },
      },
      {
        path: 'puestos-empresa',
        title: 'Puestos de Empresa',
        component: JobPositionManagementComponent,
        canActivate: [verifyPermissionGuard],
        data: {
          permission: PERMISSIONS.MANAGE_JOB,
          company: getCompanyLocalStorage() ?? null,
        },
      },
      {
        path: 'puestos-empresa/crear-puesto',
        title: 'Crear Puesto de Trabajo',
        component: CreateJobPositionComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.CREATE_JOB },
      },
      {
        path: 'puestos-empresa/:jobPositionId',
        title: 'Puesto de Trabajo',
        component: VisualizeJobPositionComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.READ_JOB },
      },
      {
        path: 'red-talenthub',
        title: 'Red TalentHub',
        component: RedTalentHubComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.READ_JOB },
      },
      {
        path: 'red-talenthub/empleos/:jobPositionId',
        title: 'Puesto de Trabajo',
        component: VisualizeJobPositionComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.READ_JOB },
      },
      {
        path: 'red-talenthub/empleos/:jobPositionId/aplicaciones',
        title: 'Aplicaciones de Empleo',
        component: JobApplicationManagementComponent,
        canActivate: [verifyPermissionGuard],
        data: { permission: PERMISSIONS.READ_APPLICATION },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
})
export class DashboardRoutingModule {}
