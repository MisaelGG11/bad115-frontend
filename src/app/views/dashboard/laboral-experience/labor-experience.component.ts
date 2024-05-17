import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LaborExperiencesListComponent } from './components/labor-experiences-list/labor-experiences-list.component';
import { CreateLaborExperienceModalComponent } from './components/create-labor-experience-modal/create-labor-experience-modal.component';
import { DeleteLaborExperienceModalComponent } from './components/delete-labor-experience-modal/delete-labor-experience-modal.component';

@Component({
  selector: 'app-laboral-experience',
  standalone: true,
  imports: [
    ButtonModule,
    LaborExperiencesListComponent,
    CreateLaborExperienceModalComponent,
    DeleteLaborExperienceModalComponent,
  ],
  templateUrl: './labor-experience.component.html',
  styles: [],
})
export class LaborExperienceComponent {
  visibleAddModal = signal(false);
  visibleDeleteModal = signal(false);
  laborExperienceId = signal('');

  constructor() {}

  showAddDialog() {
    this.visibleAddModal.set(true);
  }

  showEditDialog(laborExperienceId: string) {
    console.log('showEditDialog', laborExperienceId);
  }

  showDeleteDialog(laborExperienceId: string) {
    console.log('showDeleteDialog', laborExperienceId);

    this.laborExperienceId.set(laborExperienceId);
    this.visibleDeleteModal.set(true);
  }
}
