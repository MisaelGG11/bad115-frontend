import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PublicationsListComponent } from './components/publications-list/publications-list.component';
import { CreatePublicationModalComponent } from './components/create-publication-modal/create-publication-modal.component';
@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [ButtonModule, PublicationsListComponent, CreatePublicationModalComponent],
  templateUrl: './publications.component.html',
  styles: ``,
})
export class PublicationsComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedLaborExperience = signal('');

  showAddDialog() {
    this.showAddModal.set(true);
  }
}
