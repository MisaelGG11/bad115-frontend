import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent } from '../../../../../../../components/inputs/custom-input/custom-input.component';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { RecognitionTypeService } from '../../../../../../../services/recognition-type.service';

@Component({
  selector: 'app-edit-recognition-type',
  standalone: true,
  imports: [ButtonModule, CustomInputComponent, DialogModule, ReactiveFormsModule],
  templateUrl: './edit-recognition-type.component.html',
  styles: [],
})
export class EditRecognitionTypeComponent implements OnChanges {
  private recognitionTypeService = inject(RecognitionTypeService);
  @Input() visible = signal(false);
  @Input() recognitionTypeId = '';
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['recognitionTypeId']) {
      const { data } = await this.recognitionTypeRequest.refetch();
      this.form.patchValue({
        name: data?.name,
      });
    }
  }

  recognitionTypeRequest = injectQuery(() => ({
    queryKey: ['recognitionType', { recognitionTypeId: this.recognitionTypeId }],
    queryFn: async () => await this.recognitionTypeService.findOne(this.recognitionTypeId),
  }));

  editRecognitionTypeMutation = injectMutation(() => ({
    mutationFn: async (name: string) =>
      this.recognitionTypeService.update(this.recognitionTypeId, name),
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
