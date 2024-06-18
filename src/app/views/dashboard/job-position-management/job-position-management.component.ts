import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { JobPositionListComponent } from './components/job-position-list/job-position-list.component';
import { Router } from '@angular/router';
import { EditJobPositionComponent } from './components/edit-job-position/edit-job-position.component';
import { DeleteJobPositionComponent } from './components/delete-job-position/delete-job-position.component';
import { GlobalFunctionsService } from '../../../utils/services/global-functions.service';
import { ROLES } from '../../../utils/constants.utils';
import { Company } from '../../../interfaces/company.interface';
import { getCompanyLocalStorage } from '../../../utils/local-storage.utils';

@Component({
  selector: 'app-job-position-management',
  standalone: true,
  imports: [
    ButtonModule,
    JobPositionListComponent,
    EditJobPositionComponent,
    DeleteJobPositionComponent,
  ],
  templateUrl: './job-position-management.component.html',
  styles: ``,
})
export class JobPositionManagementComponent {
  private global = inject(GlobalFunctionsService);
  private router = inject(Router);
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedJobPositionId = signal('');
  roles = this.global.getRoles();

  canCreate() {
    return this.roles.includes(ROLES.RECRUITER);
  }
  private company: Company = getCompanyLocalStorage();
  showAddJobPositionButton = Object.keys(this.company).length === 0;

  showAddPage() {
    this.router.navigate(['/dashboard/puestos-empresa/crear-puesto']);
  }

  showVisualizePage(jobPositionId: string) {
    this.router.navigate(['/dashboard/puestos-empresa/', jobPositionId]);
  }

  showEditDialog(jobPositionId: string) {
    this.selectedJobPositionId.set(jobPositionId);
    this.showEditModal.set(true);
  }

  showDeleteDialog(certificationId: string) {
    this.selectedJobPositionId.set(certificationId);
    this.showDeleteModal.set(true);
  }
}
