import { Component, inject, OnInit } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PersonService } from '../../../../../services/person.service';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { SelectComponent } from '../../../../../components/inputs/select/select.component';
import { CalendarComponent } from '../../../../../components/inputs/calendar/calendar.component';
import { CalendarModule } from 'primeng/calendar';
import { toast } from 'ngx-sonner';
import { LOCAL_STORAGE } from '../../../../../utils/constants.utils';
import { Person } from '../../../../../interfaces/person.interface';
import { UpdatePersonDto } from '../../../../../services/interfaces/person.dto';
import { setPerson } from '../../../../../store/auth.actions';
import { Store } from '@ngrx/store';
import { getPersonLocalStorage } from '../../../../../utils/local-storage.utils';
import { CustomInputMaskComponent } from '../../../../../components/inputs/custom-input-mask/custom-input-mask.component';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
    DropdownModule,
    CustomInputComponent,
    SelectComponent,
    CalendarComponent,
    CalendarModule,
    ButtonModule,
    CustomInputMaskComponent,
  ],
  templateUrl: './profile-form.component.html',
  styles: [],
})
export class ProfileFormComponent implements OnInit {
  private personService = inject(PersonService);
  private store = inject(Store);
  queryClient = injectQueryClient();
  person = getPersonLocalStorage();
  form: FormGroup;
  maxDate: Date = new Date();
  genderOptions: Array<{ label: string; value: string }> = [];

  constructor(private readonly fb: FormBuilder) {
    this.genderOptions = [
      { label: 'Masculino', value: 'M' },
      { label: 'Femenino', value: 'F' },
    ];

    this.form = this.fb.group({
      firstName: new FormControl<string>('', [Validators.required, Validators.maxLength(50)]),
      lastName: new FormControl<string>('', Validators.required),
      middleName: new FormControl<string>(''),
      secondLastName: new FormControl<string>(''),
      birthday: new FormControl<Date>(new Date(), Validators.required),
      gender: new FormControl<string>('M', Validators.required),
      phone: new FormControl<string>(''),
    });
  }

  async ngOnInit() {
    await this.personRequest.refetch();
  }

  updatePersonMutation = injectMutation(() => ({
    mutationFn: async (input: UpdatePersonDto) => await this.personService.update(input),
    onSuccess: async () => {
      toast.success('Perfil actualizado', { duration: 3000 });
      await this.queryClient.invalidateQueries({ queryKey: ['person'] });
      await this.updateSession();
    },
  }));

  personRequest = injectQuery(() => ({
    queryKey: ['person', { personId: this.person?.id }],
    queryFn: async (): Promise<Person> => {
      const { data } = await this.personService.getPerson(this.person.id);
      this.form.patchValue({ ...data, birthday: new Date(data.birthday) });
      return data;
    },
  }));

  async submit() {
    if (this.form.valid) {
      await this.updatePersonMutation.mutateAsync({ id: this.person?.id, ...this.form.value });
    }
  }

  async updateSession() {
    const { data } = await this.personService.getPerson(this.person?.id ?? '');
    this.store.dispatch(setPerson(data));
    localStorage.setItem(LOCAL_STORAGE.PERSON, JSON.stringify(data));
  }
}
