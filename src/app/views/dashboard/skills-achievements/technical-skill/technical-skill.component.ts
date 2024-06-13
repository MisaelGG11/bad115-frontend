
import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TechnicalSkillListComponent } from './components/technical-skill-list/technical-skill-list.component';
import { CreateTechnicalSkillModalComponent } from './components/create-technical-skill-modal/create-technical-skill-modal.component';
import { DeleteTechnicalSkillModalComponent } from './components/delete-technical-skill-modal/delete-technical-skill-modal.component';
//import { EditTechnicalSkillModalComponent } from './components/edit-technical-skill-modal/edit-technical-skill-modal.component';

@Component({
  selector: 'app-technical-skill',
  standalone: true,
  imports: [
    ButtonModule,
    TechnicalSkillListComponent,
    CreateTechnicalSkillModalComponent,
    DeleteTechnicalSkillModalComponent,
    //EditTechnicalSkillModalComponent,
  ],
  templateUrl: './technical-skill.component.html',
  styles: ``,
})
export class TechnicalSkillsComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedTechnicalSkill = signal('');

  showAddDialog() {
    this.showAddModal.set(true);
  }

/*   showEditDialog(technicalSkillId: string) {
    this.selectedTechnicalSkill.set(technicalSkillId);
    this.showEditModal.set(true);
  } */

  showDeleteDialog(technicalSkillId: string) {
    this.selectedTechnicalSkill.set(technicalSkillId);
    this.showDeleteModal.set(true);
  }
}

