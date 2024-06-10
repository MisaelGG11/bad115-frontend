import { Component, inject, signal } from '@angular/core';
import { RecognitionTypeListComponent } from './components/recogtion-type-list/recognition-type-list.component';
import { ButtonModule } from 'primeng/button';
import { CreateRecognitionTypeComponent } from './components/create-recognition-type/create-recognition-type.component';
import { EditRecognitionTypeComponent } from './components/edit-recognition-type/edit-recognition-type.component';
import { DeleteRecognitionTypeComponent } from './components/delete-recognition-type/delete-recognition-type.component';
import { GlobalFunctionsService } from '../../../../../utils/services/global-functions.service';
import { PERMISSIONS } from '../../../../../utils/constants.utils';

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
  private global = inject(GlobalFunctionsService);
  showAddModal = signal(false);

  onClickCreate() {
    this.showAddModal.set(true);
  }

  canCreate() {
    return this.global.verifyPermission(PERMISSIONS.CREATE_CATALOG);
  }
}
