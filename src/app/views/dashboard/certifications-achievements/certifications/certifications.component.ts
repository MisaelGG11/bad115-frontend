import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CertificationsListComponent } from './components/certifications-list/certifications-list.component';
import { CreateCertificationModalComponent } from './components/create-certification-modal/create-certification-modal.component';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [ButtonModule, CertificationsListComponent, CreateCertificationModalComponent],
  templateUrl: './certifications.component.html',
  styles: ``,
})
export class CertificationsComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedLaborExperience = signal('');

  showAddDialog() {
    this.showAddModal.set(true);
  }
}
