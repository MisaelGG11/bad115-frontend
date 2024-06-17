import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { JobPositionListComponent } from './components/job-position-list/job-position-list.component';
import { Router } from '@angular/router';
import { EditJobPositionComponent } from './components/edit-job-position/edit-job-position.component';
import { DeleteJobPositionComponent } from './components/delete-job-position/delete-job-position.component';

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
  private router = inject(Router);
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedJobPositionId = signal('');

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
