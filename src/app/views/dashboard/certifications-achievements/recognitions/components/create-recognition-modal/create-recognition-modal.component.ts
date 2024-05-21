import { Component, inject, Input, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CustomInputComponent } from '../../../../../../components/inputs/custom-input/custom-input.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import {
  injectMutation,
  injectQueryClient,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { CandidateService } from '../../../../../../services/candidate.service';
import { CreateRecognitionDto } from '../../../../../../services/interfaces/candidate.dto';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { CalendarComponent } from '../../../../../../components/inputs/calendar/calendar.component';
import { SelectComponent } from '../../../../../../components/inputs/select/select.component';
import { RecognitionTypeCatalog } from '../../../../../../interfaces/candidate.interface';

@Component({
  selector: 'app-create-recognition-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CalendarModule,
    CustomInputComponent,
    InputTextareaModule,
    CommonModule,
    StyleClassModule,
    CalendarComponent,
    SelectComponent,
  ],
  templateUrl: './create-recognition-modal.component.html',
  styles: ``,
})
export class CreateRecognitionModalComponent {
  private candidateService = inject(CandidateService);
  private person = JSON.parse(localStorage.getItem('person') ?? '');
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  form: FormGroup;
  recognitionsTypesOptions: Array<{ label: string; value: string | { name: string } }> = [];
  today = new Date();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      recognitionType: [null, [Validators.required]],
      finishDate: [null, [Validators.required]],
    });
  }

  regonoctionsTypesRequest = injectQuery(() => ({
    queryKey: ['recognitionType'],
    queryFn: async () => {
      const data = await this.candidateService.getRecognitionTypes();
      this.addRecognitionsTypesOptions(data);
      return data;
    },
  }));

  addRecognitionsTypesOptions(types: RecognitionTypeCatalog[]) {
    this.recognitionsTypesOptions = types.map((type) => ({
      label: type.name,
      value: { name: type.name },
    }));
  }

  createRecognitionMutation = injectMutation(() => ({
    mutationFn: async (input: CreateRecognitionDto) =>
      await this.candidateService.createRecognition(this.person.candidateId, input),
    onSuccess: async () => {
      toast.success('Reconicimiento creado', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['recognitions'] });
      this.form.reset();
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.createRecognitionMutation.mutateAsync(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }
}
