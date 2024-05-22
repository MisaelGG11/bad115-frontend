import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RecognitionsListComponent } from './components/recognitions-list/recognitions-list.component';
import { CreateRecognitionModalComponent } from './components/create-recognition-modal/create-recognition-modal.component';
import { DeleteRecognitionModalComponent } from './components/delete-recognition-modal/delete-recognition-modal.component';

@Component({
  selector: 'app-recognitions',
  standalone: true,
  imports: [
    ButtonModule,
    RecognitionsListComponent,
    CreateRecognitionModalComponent,
    DeleteRecognitionModalComponent,
  ],
  templateUrl: './recognitions.component.html',
  styles: ``,
})
export class RecognitionsComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedRecognition = signal('');

  showAddDialog() {
    this.showAddModal.set(true);
  }

  showEditDialog(recognitionId: string) {
    this.selectedRecognition.set(recognitionId);
    this.showEditModal.set(true);
  }

  showDeleteDialog(recognitionId: string) {
    this.selectedRecognition.set(recognitionId);
    this.showDeleteModal.set(true);
  }
}
