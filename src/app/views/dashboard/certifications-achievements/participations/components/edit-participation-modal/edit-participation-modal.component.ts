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
import { Country } from '../../../../../../interfaces/person.interface';
import { CandidateService } from '../../../../../../services/candidate.service';
import { AddressService } from '../../../../../../services/address.service';
import { UpdateParticipationDto } from '../../../../../../services/interfaces/candidate.dto';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { CalendarComponent } from '../../../../../../components/inputs/calendar/calendar.component';
import { SelectComponent } from '../../../../../../components/inputs/select/select.component';
import { ParticipationType } from '../../../../../../interfaces/candidate.interface';

@Component({
  selector: 'app-edit-participation-modal',
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
  templateUrl: './edit-participation-modal.component.html',
  styles: ``,
})
export class EditParticipationModalComponent {
  private candidateService = inject(CandidateService);
  private addressService = inject(AddressService);
  private person = JSON.parse(localStorage.getItem('person') ?? '');
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() participationId = '';
  form: FormGroup;
  participationsTypesOptions: Array<{ label: string; value: string | { name: string } }> = [];
  countriesOptions: Array<{ label: string; value: string }> = [];
  today = new Date();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      eventHost: ['', [Validators.required]],
      participationTypeId: ['', [Validators.required]],
      date: [null, [Validators.required]],
      place: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['participationId'] && !changes['participationId'].isFirstChange()) {
      await this.participationsTypesRequest.refetch();
      await this.countriesRequest.refetch();
      const { data } = await this.participationRequest.refetch();
      console.log(data);
      this.form.patchValue({
        ...data,
        participationTypeId: data?.participationType.id,
        date: data?.date ? new Date(data.date) : null,
      });
      console.log(this.form.value);
    }
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
      console.log(data);
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

  addParticipationsTypesOptions(types: ParticipationType[]) {
    this.participationsTypesOptions = types.map((type) => ({
      label: type.name,
      value: type.id,
    }));
  }

  participationRequest = injectQuery(() => ({
    queryKey: [
      'participations',
      {
        candidateId: this.person.candidateId,
        participationId: this.participationId,
      },
    ],
    queryFn: async () =>
      await this.candidateService.getParticipation(this.person.candidateId, this.participationId),
    enabled: !!this.participationId,
  }));

  editParticipationMutation = injectMutation(() => ({
    mutationFn: async (updateParticipationDto: UpdateParticipationDto) =>
      await this.candidateService.updateParticipation(
        this.person.candidateId,
        this.participationId,
        updateParticipationDto,
      ),
    onSuccess: async () => {
      toast.success('Participación actualizada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['participations'] });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.editParticipationMutation.mutateAsync(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }

  ngOnInit(): void {
    if (this.visible()) {
      this.countriesRequest.refetch();
      this.participationsTypesRequest.refetch();
    }
  }
}
