import { Component, inject, OnInit } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { DocumentTypeEnum, Person } from '../../../../../interfaces/person.interface';
import { getPersonLocalStorage } from '../../../../../utils/person-local-storage.utils';
import { PersonService } from '../../../../../services/person.service';
import { ButtonModule } from 'primeng/button';
import { CalendarComponent } from '../../../../../components/inputs/calendar/calendar.component';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectComponent } from '../../../../../components/inputs/select/select.component';
import { CustomInputMaskComponent } from '../../../../../components/inputs/custom-input-mask/custom-input-mask.component';
import { NgForOf } from '@angular/common';
import { InputMaskModule } from 'primeng/inputmask';
import { UpsertDocumentDto } from '../../../../../services/interfaces/person.dto';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-documents-form',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarComponent,
    CustomInputComponent,
    FormsModule,
    ProgressSpinnerModule,
    SelectComponent,
    ReactiveFormsModule,
    NgForOf,
    InputMaskModule,
    CustomInputMaskComponent,
  ],
  templateUrl: './documents-form.component.html',
  styles: [],
})
export class DocumentsFormComponent implements OnInit {
  private personService = inject(PersonService);
  private queryClient = injectQueryClient();
  person = getPersonLocalStorage();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      duiId: [''],
      duiNumber: [''],
      nitId: [''],
      nitNumber: [''],
      passportId: [''],
      passportNumber: [''],
      nupId: [''],
      nupNumber: [''],
    });
  }

  async ngOnInit() {
    await this.personRequest.refetch();
  }

  personRequest = injectQuery(() => ({
    queryKey: ['person', { personId: this.person?.id }],
    queryFn: async (): Promise<Person> => {
      const { data } = await this.personService.getPerson(this.person.id);
      const { documents } = data;

      if (!documents) {
        return data;
      }

      this.form.patchValue({
        duiId: documents.find((document) => document.type === DocumentTypeEnum.DUI)?.id,
        duiNumber:
          documents.find((document) => document.type === DocumentTypeEnum.DUI)?.number ?? '',
        nitId: documents.find((document) => document.type === DocumentTypeEnum.NIT)?.id,
        nitNumber:
          documents.find((document) => document.type === DocumentTypeEnum.NIT)?.number ?? '',
        passportId: documents.find((document) => document.type === DocumentTypeEnum.PASSPORT)?.id,
        passportNumber:
          documents.find((document) => document.type === DocumentTypeEnum.PASSPORT)?.number ?? '',
        nupId: documents.find((document) => document.type === DocumentTypeEnum.NUP)?.id,
        nupNumber:
          documents.find((document) => document.type === DocumentTypeEnum.NUP)?.number ?? '',
      });

      return data;
    },
  }));

  upsertDocumentMutation = injectMutation(() => ({
    mutationFn: async (input: UpsertDocumentDto) =>
      await this.personService.upsertDocument(this.person.id, input),
    onSuccess: async () => {
      await this.queryClient.invalidateQueries({ queryKey: ['person'] });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const documents = [
      { id: this.form.value.duiId, type: DocumentTypeEnum.DUI, number: this.form.value.duiNumber },
      { id: this.form.value.nitId, type: DocumentTypeEnum.NIT, number: this.form.value.nitNumber },
      {
        id: this.form.value.passportId,
        type: DocumentTypeEnum.PASSPORT,
        number: this.form.value.passportNumber,
      },
      { id: this.form.value.nupId, type: DocumentTypeEnum.NUP, number: this.form.value.nupNumber },
    ];

    await Promise.all([
      documents.map((doc) => {
        if (doc.number === '') {
          return null;
        }

        return this.upsertDocumentMutation.mutateAsync(doc);
      }),
    ]);
    await this.personRequest.refetch();
    toast.success('Documentos actualizados', { duration: 3000 });
  }
}
