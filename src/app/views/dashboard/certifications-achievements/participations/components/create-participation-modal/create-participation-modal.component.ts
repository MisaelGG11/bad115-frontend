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
import { Country } from '../../../../../../interfaces/person.interface';
import { CandidateService } from '../../../../../../services/candidate.service';
import { AddressService } from '../../../../../../services/address.service';
import { CreateParticipationDto } from '../../../../../../services/interfaces/candidate.dto';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { CalendarComponent } from '../../../../../../components/inputs/calendar/calendar.component';
import { SelectComponent } from '../../../../../../components/inputs/select/select.component';
import { RecognitionTypeCatalog } from '../../../../../../interfaces/candidate.interface';

@Component({
  selector: 'app-create-participation-modal',
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
  templateUrl: './create-participation-modal.component.html',
  styles: ``,
})
export class CreateParticipationModalComponent {
  private candidateService = inject(CandidateService);
  private addressService = inject(AddressService);
  private person = JSON.parse(localStorage.getItem('person') ?? '');
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  form: FormGroup;
  participationsTypesOptions: Array<{ label: string; value: string | { name: string } }> = [];
  countriesOptions: Array<{ label: string; value: string }> = [];
  today = new Date();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      eventHost: ['', [Validators.required]],
      participacionType: [null, [Validators.required]],
      date: [null, [Validators.required]],
      place: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  }

  participationsTypesRequest = injectQuery(() => ({
    queryKey: ['participationType'],
    queryFn: async () => {
      const data = await this.candidateService.getParticipationTypes();
      this.addParticipationsTypesOptions(data);
      return data;
    },
  }));

  countriesRequest = injectQuery(() => ({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data } = await this.addressService.getCountries();
      this.addCountriesOptions(data);
      return data;
    },
  }));

  addCountriesOptions(countries: Country[]) {
    this.countriesOptions = countries.map((country) => ({
      label: country.name,
      value: country.name,
    }));
  }

  addParticipationsTypesOptions(types: RecognitionTypeCatalog[]) {
    this.participationsTypesOptions = types.map((type) => ({
      label: type.name,
      value: { name: type.name },
    }));
  }

  createParticipationMutation = injectMutation(() => ({
    mutationFn: async (input: CreateParticipationDto) =>
      await this.candidateService.createParticipation(this.person.candidateId, input),
    onSuccess: async () => {
      toast.success('Participación creada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['participations'] });
      this.form.reset();
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.createParticipationMutation.mutateAsync(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }
}
