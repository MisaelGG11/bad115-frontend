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
import { UpdatePublicationDto } from '../../../../../../services/interfaces/candidate.dto';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { CalendarComponent } from '../../../../../../components/inputs/calendar/calendar.component';
import { SelectComponent } from '../../../../../../components/inputs/select/select.component';

@Component({
  selector: 'app-edit-publication-modal',
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
  templateUrl: './edit-publication-modal.component.html',
  styles: ``,
})
export class EditPublicationModalComponent {
  private candidateService = inject(CandidateService);
  private person = JSON.parse(localStorage.getItem('person') ?? '');
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() publicationId = '';
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

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['publicationId'] && !changes['publicationId'].isFirstChange()) {
      const { data } = await this.publicationRequest.refetch();
      console.log(data);
      this.form.patchValue({
        ...data,
      });
      console.log(this.form.value);
    }
  }

  publicationRequest = injectQuery(() => ({
    queryKey: [
      'publications',
      {
        candidateId: this.person.candidateId,
        publicationId: this.publicationId,
      },
    ],
    queryFn: async () =>
      await this.candidateService.getPublication(this.person.candidateId, this.publicationId),
    enabled: !!this.publicationId,
  }));

  editPublicationMutation = injectMutation(() => ({
    mutationFn: async (updatePublicationDto: UpdatePublicationDto) =>
      await this.candidateService.updatePublication(
        this.person.candidateId,
        this.publicationId,
        updatePublicationDto,
      ),
    onSuccess: async () => {
      toast.success('Publicación actualizada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['publications'] });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.editPublicationMutation.mutateAsync(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }
}
