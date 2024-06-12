import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../../../interfaces/user.interface';
import { UserService } from '../../../../../services/user.service';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { DialogModule } from 'primeng/dialog';
import { SelectComponent } from '../../../../../components/inputs/select/select.component';
import { CalendarComponent } from '../../../../../components/inputs/calendar/calendar.component';
import { toast } from 'ngx-sonner';
import { TooltipModule } from 'primeng/tooltip';
import { PersonService } from '../../../../../services/person.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarModule,
    CustomInputComponent,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    CalendarComponent,
    TooltipModule,
  ],
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnChanges {
  private userService = inject(UserService);
  private personService = inject(PersonService);
  private queryClient = injectQueryClient();
  @Input() readOnly = signal(false);
  @Input() visible = signal(false);
  @Input() user!: User;
  maxDate = new Date();
  genderOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
  ];
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      secondLastName: [''],
      birthday: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  userRequest = injectQuery(() => ({
    queryKey: ['user', { id: this.user?.id }],
    queryFn: async () => {
      const response = await this.userService.findOneUser(this.user.id);

      this.form.patchValue({
        email: response.email,
        firstName: response.person.firstName,
        lastName: response.person.lastName,
        middleName: response.person.middleName,
        secondLastName: response.person.secondLastName,
        birthday: new Date(response.person.birthday),
        gender: response.person.gender,
      });

      return response;
    },
    enabled: !!this.user.id,
  }));

  editUserMutation = injectMutation(() => ({
    mutationFn: async () =>
      this.personService.update({
        id: this.userRequest.data()!.person.id,
        ...this.form.value,
      }),
    onSuccess: async () => {
      toast.success('Usuario actualizado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.editUserMutation.mutateAsync();
    this.form.reset();
    this.visible.set(false);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && !changes['user'].isFirstChange()) {
      await this.userRequest.refetch();
    }
  }
}
