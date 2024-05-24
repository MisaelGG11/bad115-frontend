import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent } from '../../../../../../../components/inputs/custom-input/custom-input.component';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { RecognitionTypeService } from '../../../../../../../services/recognition-type.service';
import { RecognitionType } from '../../../../../../../interfaces/recognition-type.interface';

@Component({
  selector: 'app-edit-recognition-type',
  standalone: true,
  imports: [ButtonModule, CustomInputComponent, DialogModule, ReactiveFormsModule],
  templateUrl: './edit-recognition-type.component.html',
  styles: [],
})
export class EditRecognitionTypeComponent implements OnChanges {
  private recognitionTypeService = inject(RecognitionTypeService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() recognitionType!: RecognitionType;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['recognitionType'] && !changes['recognitionType'].isFirstChange()) {
      this.form.patchValue({
        name: this.recognitionType.name,
      });
    }
  }

  editRecognitionTypeMutation = injectMutation(() => ({
    mutationFn: async (name: string) =>
      this.recognitionTypeService.update(this.recognitionType.id, name),
    onSuccess: async () => {
      await this.queryClient.invalidateQueries({
        queryKey: ['recognitionTypes'],
      });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.editRecognitionTypeMutation.mutateAsync(this.form.value.name);
    this.visible.set(false);
  }
}
