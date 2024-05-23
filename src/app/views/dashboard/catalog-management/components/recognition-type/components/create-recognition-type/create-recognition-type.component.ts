import { Component, inject, Input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarComponent } from '../../../../../../../components/inputs/calendar/calendar.component';
import { CustomInputComponent } from '../../../../../../../components/inputs/custom-input/custom-input.component';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectComponent } from '../../../../../../../components/inputs/select/select.component';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { RecognitionTypeService } from '../../../../../../../services/recognition-type.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-create-recognition-type',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarComponent,
    CustomInputComponent,
    DialogModule,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './create-recognition-type.component.html',
  styles: [],
})
export class CreateRecognitionTypeComponent {
  private recognitionTypeService = inject(RecognitionTypeService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  createRecognitionTypeMutation = injectMutation(() => ({
    mutationFn: async (name: string) => this.recognitionTypeService.create(name),
    onSuccess: async () => {
      toast.success('Tipo de reconocimiento creado exitosamente', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['recognitionTypes'] });
      this.form.reset();
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.createRecognitionTypeMutation.mutateAsync(this.form.value.name);
  }
}
