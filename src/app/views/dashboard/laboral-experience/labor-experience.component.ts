import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LaborExperiencesListComponent } from './components/labor-experiences-list/labor-experiences-list.component';
import { CreateLaborExperienceModalComponent } from './components/create-labor-experience-modal/create-labor-experience-modal.component';
import { DeleteLaborExperienceModalComponent } from './components/delete-labor-experience-modal/delete-labor-experience-modal.component';
import { EditLaborExperienceModalComponent } from './components/edit-labor-experience-modal/edit-labor-experience-modal.component';

@Component({
  selector: 'app-laboral-experience',
  standalone: true,
  imports: [
    ButtonModule,
    LaborExperiencesListComponent,
    CreateLaborExperienceModalComponent,
    DeleteLaborExperienceModalComponent,
    EditLaborExperienceModalComponent,
  ],
  templateUrl: './labor-experience.component.html',
  styles: [],
})
export class LaborExperienceComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedLaborExperience = signal('');

  constructor() {}

  showAddDialog() {
    this.showAddModal.set(true);
  }

  showEditDialog(laborExperienceId: string) {
    this.selectedLaborExperience.set(laborExperienceId);
    this.showEditModal.set(true);
  }

  showDeleteDialog(laborExperienceId: string) {
    this.selectedLaborExperience.set(laborExperienceId);
    this.showDeleteModal.set(true);
  }
}
