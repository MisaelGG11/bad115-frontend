import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SocialMediaListComponent } from './components/social-media-list/social-media-list.component';
import { CreateSocialMediaModalComponent } from './components/create-social-media-modal/create-social-media-modal.component';
import { EditSocialMediaModalComponent } from './components/edit-social-media-modal/edit-social-media-modal.component';
import { DeleteSocialMediaModalComponent } from './components/delete-social-media-modal/delete-social-media-modal.component';

@Component({
  selector: 'app-social-media',
  standalone: true,
  imports: [
    ButtonModule,
    SocialMediaListComponent,
    CreateSocialMediaModalComponent,
    EditSocialMediaModalComponent,
    DeleteSocialMediaModalComponent,
  ],
  templateUrl: './social-media.component.html',
  styles: ``,
})
export class SocialMediaComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedSocialMedia = signal('');

  showAddDialog() {
    this.showAddModal.set(true);
  }

  showEditDialog(socialMediaId: string) {
    this.selectedSocialMedia.set(socialMediaId);
    this.showEditModal.set(true);
  }

  showDeleteDialog(socialMediaId: string) {
    this.selectedSocialMedia.set(socialMediaId);
    this.showDeleteModal.set(true);
  }
}
