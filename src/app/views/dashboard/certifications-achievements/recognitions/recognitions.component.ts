import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RecognitionsListComponent } from './components/recognitions-list/recognitions-list.component';
import { CreateRecognitionModalComponent } from './components/create-recognition-modal/create-recognition-modal.component';

@Component({
  selector: 'app-recognitions',
  standalone: true,
  imports: [ButtonModule, RecognitionsListComponent, CreateRecognitionModalComponent],
  templateUrl: './recognitions.component.html',
  styles: ``,
})
export class RecognitionsComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedLaborExperience = signal('');

  showAddDialog() {
    this.showAddModal.set(true);
  }
}
