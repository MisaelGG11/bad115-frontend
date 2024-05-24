import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
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
import { UpdateRecognitionDto } from '../../../../../../services/interfaces/candidate.dto';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { CalendarComponent } from '../../../../../../components/inputs/calendar/calendar.component';
import { SelectComponent } from '../../../../../../components/inputs/select/select.component';
import { RecognitionType } from '../../../../../../interfaces/candidate.interface';

@Component({
  selector: 'app-edit-recognition-modal',
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
  templateUrl: './edit-recognition-modal.component.html',
  styles: ``,
})
export class EditRecognitionModalComponent {
  private candidateService = inject(CandidateService);
  private person = JSON.parse(localStorage.getItem('person') ?? '');
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() recognitionId = '';
  form: FormGroup;
  selectedType = signal('');
  recognitionsTypesOptions: Array<{ label: string; value: string | { name: string } }> = [];
  today = new Date();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      recognitionTypeId: ['', [Validators.required]],
      finishDate: [null, [Validators.required]],
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['recognitionId'] && !changes['recognitionId'].isFirstChange()) {
      await this.recognitionsTypesRequest.refetch();
      const { data } = await this.recognitionRequest.refetch();
      console.log(data);
      this.form.patchValue({
        ...data,
        recognitionTypeId: data?.recognitionType.id,
        finishDate: data?.finishDate ? new Date(data.finishDate) : null,
      });
      console.log(this.form.value);
    }
  }

  recognitionsTypesRequest = injectQuery(() => ({
    queryKey: ['recognitionType'],
    queryFn: async () => {
      const data = await this.candidateService.getRecognitionTypes();
      this.addRecognitionsTypesOptions(data);
      return data;
    },
  }));

  addRecognitionsTypesOptions(types: RecognitionType[]) {
    this.recognitionsTypesOptions = types.map((type) => ({
      label: type.name,
      value: type.id,
    }));
  }

  recognitionRequest = injectQuery(() => ({
    queryKey: [
      'recognitions',
      {
        candidateId: this.person.candidateId,
        recognitionId: this.recognitionId,
      },
    ],
    queryFn: async () =>
      await this.candidateService.getRecognition(this.person.candidateId, this.recognitionId),
    enabled: !!this.recognitionId,
  }));

  editRecognitionMutation = injectMutation(() => ({
    mutationFn: async (updateRecognitionDto: UpdateRecognitionDto) =>
      await this.candidateService.updateRecognition(
        this.person.candidateId,
        this.recognitionId,
        updateRecognitionDto,
      ),
    onSuccess: async () => {
      toast.success('Reconocimiento actualizado', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['recognitions'] });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.editRecognitionMutation.mutateAsync(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }
}
