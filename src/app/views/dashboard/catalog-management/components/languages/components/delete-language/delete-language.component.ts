import { Component, inject, Input, signal } from '@angular/core';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { LanguageService } from '../../../../../../../services/language.service';
import { Language } from '../../../../../../../interfaces/language.interface';
import { toast } from 'ngx-sonner';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-delete-language',
  standalone: true,
  imports: [ButtonModule, DialogModule],
  templateUrl: './delete-language.component.html',
})
export class DeleteLanguageComponent {
  private languageService = inject(LanguageService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() language!: Language;

  deleteLanguageMutation = injectMutation(() => ({
    mutationFn: async () => this.languageService.delete(this.language.id),
    onSuccess: async () => {
      toast.success('Idioma eliminado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['languages'],
      });
    },
  }));

  async delete() {
    await this.deleteLanguageMutation.mutateAsync();
    this.visible.set(false);
  }
}
