import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { JobPositionListComponent } from '../job-position-management/components/job-position-list/job-position-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-position-candidates',
  standalone: true,
  imports: [ButtonModule, JobPositionListComponent],
  templateUrl: './job-position-candidates.component.html',
  styles: ``,
})
export class JobPositionCandidatesComponent {
  private router = inject(Router);
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedTest = signal('');

  showAddPage() {
    this.router.navigate(['/dashboard/puestos-empresa/crear-puesto']);
  }

  showVisualizePage(jobPositionId: string) {
    this.router.navigate(['/dashboard/red-talenthub/empleos/', jobPositionId]);
  }

  showEditDialog(certificationId: string) {
    this.selectedTest.set(certificationId);
    this.showEditModal.set(true);
  }

  showDeleteDialog(certificationId: string) {
    this.selectedTest.set(certificationId);
    this.showDeleteModal.set(true);
  }
}
