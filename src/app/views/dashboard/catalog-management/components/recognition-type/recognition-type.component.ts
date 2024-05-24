import { Component, signal } from '@angular/core';
import { RecognitionTypeListComponent } from './components/recogtion-type-list/recognition-type-list.component';
import { ButtonModule } from 'primeng/button';
import { CreateRecognitionTypeComponent } from './components/create-recognition-type/create-recognition-type.component';
import { EditRecognitionTypeComponent } from './components/edit-recognition-type/edit-recognition-type.component';

@Component({
  selector: 'app-recognition-type',
  standalone: true,
  imports: [
    RecognitionTypeListComponent,
    ButtonModule,
    CreateRecognitionTypeComponent,
    EditRecognitionTypeComponent,
  ],
  templateUrl: './recognition-type.component.html',
  styles: [],
})
export class RecognitionTypeComponent {
  showAddModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  selectedRecognitionType = signal('');

  onClickCreate() {
    this.showAddModal.set(true);
  }

  onClickEdit(recognitionTypeId: string) {
    this.selectedRecognitionType.set(recognitionTypeId);
    this.showEditModal.set(true);
  }

  onClickDelete(recognitionTypeId: string) {
    this.selectedRecognitionType.set(recognitionTypeId);
    this.showDeleteModal.set(true);
  }
}
