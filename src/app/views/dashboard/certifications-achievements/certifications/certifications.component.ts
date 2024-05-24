import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CertificationsListComponent } from './components/certifications-list/certifications-list.component';
import { CreateCertificationModalComponent } from './components/create-certification-modal/create-certification-modal.component';
import { DeleteCertificationModalComponent } from './components/delete-certification-modal/delete-certification-modal.component';
import { EditCertificationModalComponent } from './components/edit-certification-modal/edit-certification-modal.component';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [
    ButtonModule,
    CertificationsListComponent,
    CreateCertificationModalComponent,
    DeleteCertificationModalComponent,
    EditCertificationModalComponent,
  ],
  templateUrl: './certifications.component.html',
  styles: ``,
})
export class CertificationsComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedCertification = signal('');

  showAddDialog() {
    this.showAddModal.set(true);
  }

  showEditDialog(certificationId: string) {
    this.selectedCertification.set(certificationId);
    this.showEditModal.set(true);
  }

  showDeleteDialog(certificationId: string) {
    this.selectedCertification.set(certificationId);
    this.showDeleteModal.set(true);
  }
}
