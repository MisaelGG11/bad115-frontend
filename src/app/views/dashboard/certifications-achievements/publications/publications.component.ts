import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PublicationsListComponent } from './components/publications-list/publications-list.component';
import { CreatePublicationModalComponent } from './components/create-publication-modal/create-publication-modal.component';
import { DeletePublicationModalComponent } from './components/delete-publication-modal/delete-publication-modal.component';
import { EditPublicationModalComponent } from './components/edit-publication-modal/edit-publication-modal.component';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [
    ButtonModule,
    PublicationsListComponent,
    CreatePublicationModalComponent,
    DeletePublicationModalComponent,
    EditPublicationModalComponent,
  ],
  templateUrl: './publications.component.html',
  styles: ``,
})
export class PublicationsComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedPublication = signal('');

  showAddDialog() {
    this.showAddModal.set(true);
  }

  showEditDialog(publicationId: string) {
    this.selectedPublication.set(publicationId);
    this.showEditModal.set(true);
  }

  showDeleteDialog(publicationId: string) {
    this.selectedPublication.set(publicationId);
    this.showDeleteModal.set(true);
  }
}
