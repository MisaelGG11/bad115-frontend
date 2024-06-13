import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LanguageSkillsListComponent } from './components/language-skills-list/language-skills-list.component';
import { CreateLanguageSkillModalComponent } from './components/create-language-skills-modal/create-language-skills-modal.component';
import { DeleteLanguageSkillModalComponent } from './components/delete-language-skills-modal/delete-language-skills-modal.component';
import { EditLanguageSkillModalComponent } from './components/edit-language-skills-modal/edit-language-skills-modal.component';

@Component({
  selector: 'app-language-skills',
  standalone: true,
  imports: [
    ButtonModule,
    LanguageSkillsListComponent,
    CreateLanguageSkillModalComponent,
    DeleteLanguageSkillModalComponent,
    EditLanguageSkillModalComponent,
  ],
  templateUrl: './language-skills.component.html',
  styles: ``,
})
export class LanguageSkillsComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedLanguageSkill = signal('');

  showAddDialog() {
    this.showAddModal.set(true);
  }

  showEditDialog(LanguageSkillId: string) {
    this.selectedLanguageSkill.set(LanguageSkillId);
    this.showEditModal.set(true);
  }

  showDeleteDialog(LanguageSkillId: string) {
    this.selectedLanguageSkill.set(LanguageSkillId);
    this.showDeleteModal.set(true);
  }
}


