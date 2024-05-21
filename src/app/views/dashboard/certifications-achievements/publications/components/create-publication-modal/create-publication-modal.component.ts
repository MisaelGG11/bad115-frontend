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
import { CreatePublicationDto } from '../../../../../../services/interfaces/candidate.dto';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { CalendarComponent } from '../../../../../../components/inputs/calendar/calendar.component';
import { SelectComponent } from '../../../../../../components/inputs/select/select.component';
import { RecognitionTypeCatalog } from '../../../../../../interfaces/candidate.interface';

@Component({
  selector: 'app-create-publication-modal',
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
  templateUrl: './create-publication-modal.component.html',
  styles: ``,
})
export class CreatePublicationModalComponent {
  private candidateService = inject(CandidateService);
  private person = JSON.parse(localStorage.getItem('person') ?? '');
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  form: FormGroup;
  publicationsTypesOptions: Array<{ label: string; value: string }> = [
    { label: 'Artículo', value: 'Articulo' },
    { label: 'Libro', value: 'Libro' },
  ];
  today = new Date();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      place: ['', [Validators.required]],
      isbn: [''],
      edition: ['', [Validators.required, Validators.min(1)]],
    });

    this.form.get('type')?.valueChanges.subscribe((value) => {
      if (value === 'Libro') {
        this.form.get('isbn')?.setValidators([Validators.required]);
        this.form.get('edition')?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        this.form.get('isbn')?.setValidators([]);
        this.form.get('edition')?.setValidators([]);
      }
      this.form.get('isbn')?.updateValueAndValidity();
      this.form.get('edition')?.updateValueAndValidity();
    });
  }

  createPublicationMutation = injectMutation(() => ({
    mutationFn: async (input: CreatePublicationDto) =>
      await this.candidateService.createPublication(this.person.candidateId, input),
    onSuccess: async () => {
      toast.success('Publicación creada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['publications'] });
      this.form.reset();
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.createPublicationMutation.mutateAsync(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }
}
