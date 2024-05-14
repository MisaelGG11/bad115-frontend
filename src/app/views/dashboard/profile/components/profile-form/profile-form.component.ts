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
import { CalendarModule } from 'primeng/calendar';
import { toast } from 'ngx-sonner';
import { LOCAL_STORAGE } from '../../../../../utils/constants.utils';
import { Person } from '../../../../../interfaces/person';
import { UpdatePersonDto } from '../../../../../services/interfaces/person.interface';
import { setPerson } from '../../../../../store/auth.actions';
import { Store } from '@ngrx/store';

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
    CalendarModule,
    ButtonModule,
  ],
  templateUrl: './profile-form.component.html',
  styles: [],
})
export class ProfileFormComponent {
  private personService = inject(PersonService);
  private store = inject(Store);
  queryClient = injectQueryClient();
  person = JSON.parse(localStorage.getItem(LOCAL_STORAGE.PERSON) ?? '');
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
    });
  }

  updatePersonMutation = injectMutation(() => ({
    mutationFn: async (input: UpdatePersonDto) => await this.personService.update(input),
    onError: async (error) => {
      toast.error('Error al actualizar el perfil');
    },
    onSuccess: async () => {
      toast.success('Perfil actualizado', { duration: 3000 });
      await this.queryClient.invalidateQueries({ queryKey: ['person'] });
      await this.updateSession();
    },
  }));

  personRequest = injectQuery(() => ({
    queryKey: ['person', this.person?.id],
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
