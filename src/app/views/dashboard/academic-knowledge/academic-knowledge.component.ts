import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AcademicKnowledgesListComponent } from './components/academic-knowledge-list/academic-knowledge-list.component';
import { CreateAcademicKnowledgeModalComponent } from './components/create-academic-knowledge-modal/create-academic-knowledge-modal.component';
import { DeleteAcademicKnowledgeModalComponent } from './components/delete-academic-knowledge-modal/delete-academic-knowledge-modal.component';
import { EditAcademicKnowledgeModalComponent } from './components/edit-academic-knowledge-modal/edit-academic-knowledge-modal.component';

@Component({
  selector: 'app-academic-knowledge',
  standalone: true,
  imports: [
    ButtonModule,
    AcademicKnowledgesListComponent,
    CreateAcademicKnowledgeModalComponent,
    DeleteAcademicKnowledgeModalComponent,
    EditAcademicKnowledgeModalComponent,
  ],
  templateUrl: './academic-knowledge.component.html',
  styles: [],
})
export class AcademicKnowledgeComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedAcademicKnowledge = signal('');

  constructor() {}

  showAddDialog() {
    this.showAddModal.set(true);
  }

  showEditDialog(academicKnowledgeId: string) {
    this.selectedAcademicKnowledge.set(academicKnowledgeId);
    this.showEditModal.set(true);
  }

  showDeleteDialog(academicKnowledgeId: string) {
    this.selectedAcademicKnowledge.set(academicKnowledgeId);
    this.showDeleteModal.set(true);
  }
}

