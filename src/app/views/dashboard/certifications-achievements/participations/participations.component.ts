import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ParticipationsListComponent } from './components/participations-list-component/participations-list.component';
import { CreateParticipationModalComponent } from './components/create-participation-modal/create-participation-modal.component';

@Component({
  selector: 'app-participations',
  standalone: true,
  imports: [ButtonModule, ParticipationsListComponent, CreateParticipationModalComponent],
  templateUrl: './participations.component.html',
  styles: ``,
})
export class ParticipationsComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedLaborExperience = signal('');

  showAddDialog() {
    this.showAddModal.set(true);
  }
}
