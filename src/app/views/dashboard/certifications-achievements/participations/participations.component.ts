import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ParticipationsListComponent } from './components/participations-list-component/participations-list.component';
import { CreateParticipationModalComponent } from './components/create-participation-modal/create-participation-modal.component';
import { DeleteParticipationModalComponent } from './components/delete-participation-modal/delete-participation-modal.component';
import { EditParticipationModalComponent } from './components/edit-participation-modal/edit-participation-modal.component';

@Component({
  selector: 'app-participations',
  standalone: true,
  imports: [
    ButtonModule,
    ParticipationsListComponent,
    CreateParticipationModalComponent,
    DeleteParticipationModalComponent,
    EditParticipationModalComponent,
  ],
  templateUrl: './participations.component.html',
  styles: ``,
})
export class ParticipationsComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedParticipation = signal('');

  showAddDialog() {
    this.showAddModal.set(true);
  }

  showEditDialog(participationId: string) {
    this.selectedParticipation.set(participationId);
    this.showEditModal.set(true);
  }

  showDeleteDialog(participationId: string) {
    this.selectedParticipation.set(participationId);
    this.showDeleteModal.set(true);
  }
}
