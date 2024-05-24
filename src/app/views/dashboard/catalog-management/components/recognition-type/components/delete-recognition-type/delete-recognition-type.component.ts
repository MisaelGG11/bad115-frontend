import { Component, Input, OnChanges, SimpleChanges, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { RecognitionTypeService } from '../../../../../../../services/recognition-type.service';
import { RecognitionType } from '../../../../../../../interfaces/recognition-type.interface';

@Component({
  selector: 'app-delete-recognition-type',
  standalone: true,
  imports: [ButtonModule, DialogModule],
  templateUrl: './delete-recognition-type.component.html',
  styles: [],
})
export class DeleteRecognitionTypeComponent implements OnChanges {
  private recognitionTypeService = inject(RecognitionTypeService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() recognitionType!: RecognitionType;

  async ngOnChanges(changes: SimpleChanges): Promise<void> {}

  closeModal() {
    this.visible.set(false);
  }

  deleteRecognitionTypeMutation = injectMutation(() => ({
    mutationFn: async () => this.recognitionTypeService.delete(this.recognitionType.id),
    onSuccess: async () => {
      await this.queryClient.invalidateQueries({
        queryKey: ['recognitionTypes'],
      });
    },
  }));

  async delete() {
    await this.deleteRecognitionTypeMutation.mutateAsync();
    this.closeModal();
  }
}
