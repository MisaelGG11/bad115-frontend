import { Component, inject, Input, signal } from '@angular/core';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../../../../services/auth.service';
import { DialogModule } from 'primeng/dialog';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SelectComponent } from '../../../../../components/inputs/select/select.component';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    CustomInputComponent,
    CalendarModule,
    DropdownModule,
    SelectComponent,
  ],
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent {
  private authService = inject(AuthService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  maxDate = new Date();
  genderOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      secondLastName: [''],
      birthday: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  createUserMutation = injectMutation(() => ({
    mutationFn: async () => this.authService.signup(this.form.value),
    onSuccess: async () => {
      toast.success('Usuario creado', { duration: 3000 });
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

    await this.createUserMutation.mutateAsync();
    this.form.reset();
    this.visible.set(false);
  }
}
