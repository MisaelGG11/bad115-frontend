import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CreateRecognitionTypeComponent } from '../recognition-type/components/create-recognition-type/create-recognition-type.component';
import { RecognitionTypeListComponent } from '../recognition-type/components/recogtion-type-list/recognition-type-list.component';
import { LanguageListComponent } from './components/language-list/language-list.component';
import { GlobalFunctionsService } from '../../../../../utils/services/global-functions.service';
import { PERMISSIONS } from '../../../../../utils/constants.utils';

@Component({
  selector: 'app-languages',
  standalone: true,
  imports: [
    ButtonModule,
    CreateRecognitionTypeComponent,
    RecognitionTypeListComponent,
    LanguageListComponent,
  ],
  templateUrl: './languages.component.html',
})
export class LanguagesComponent {
  private global = inject(GlobalFunctionsService);
  showAddModal = signal(false);

  onClickCreate() {
    this.showAddModal.set(true);
  }

  canCreate() {
    return this.global.verifyPermission(PERMISSIONS.CREATE_CATALOG);
  }
}
