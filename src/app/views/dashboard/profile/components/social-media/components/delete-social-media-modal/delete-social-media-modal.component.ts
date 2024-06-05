import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonService } from '../../../../../../../services/person.service';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { getPersonLocalStorage } from '../../../../../../../utils/local-storage.utils';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-delete-social-media-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './delete-social-media-modal.component.html',
  styles: ``,
})
export class DeleteSocialMediaModalComponent {
  private personService = inject(PersonService);
  private person = getPersonLocalStorage();
  @Input() visible = signal(false);
  @Input() socialMediaId = signal('');
  queryClient = injectQueryClient();

  constructor() {}

  positionQuery = injectQuery(() => ({
    queryKey: [
      'socialMedia',
      {
        personId: this.person.id,
        socialMediaId: this.socialMediaId(),
      },
    ],
    queryFn: async () =>
      await this.personService.getSocialMedia(this.person.id, this.socialMediaId()),
    enabled: !!this.socialMediaId(),
  }));

  deleteSocialMediaMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.personService.deleteSocialMedia(this.person.id, this.socialMediaId()),
    onSuccess: async () => {
      toast.success('Red social eliminada', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: [
          'socialMedia',
          {
            personId: this.person.id,
          },
        ],
        exact: true,
      });
    },
  }));

  async delete() {
    await this.deleteSocialMediaMutation.mutateAsync();
    this.visible.set(false);
  }

  closeModal() {
    this.visible.set(false);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['socialMediaId'] && !changes['socialMediaId'].isFirstChange()) {
      await this.positionQuery.refetch();
    }
  }
}
