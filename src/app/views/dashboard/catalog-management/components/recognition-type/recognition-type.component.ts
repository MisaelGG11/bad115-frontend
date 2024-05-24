import { Component, signal } from '@angular/core';
import { RecognitionTypeListComponent } from './components/recogtion-type-list/recognition-type-list.component';
import { ButtonModule } from 'primeng/button';
import { CreateRecognitionTypeComponent } from './components/create-recognition-type/create-recognition-type.component';
import { EditRecognitionTypeComponent } from './components/edit-recognition-type/edit-recognition-type.component';
import { DeleteRecognitionTypeComponent } from './components/delete-recognition-type/delete-recognition-type.component';

@Component({
  selector: 'app-recognition-type',
  standalone: true,
  imports: [
    RecognitionTypeListComponent,
    ButtonModule,
    CreateRecognitionTypeComponent,
    EditRecognitionTypeComponent,
    DeleteRecognitionTypeComponent,
  ],
  templateUrl: './recognition-type.component.html',
  styles: [],
})
export class RecognitionTypeComponent {
  showAddModal = signal(false);

  onClickCreate() {
    this.showAddModal.set(true);
  }
}
