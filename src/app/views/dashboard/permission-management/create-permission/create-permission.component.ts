import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent } from '../../../../components/inputs/custom-input/custom-input.component';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { UserService } from '../../../../services/user.service';
import { Permission } from '../../../../interfaces/user.interface';
import { PermissionDto } from '../../../../services/interfaces/user.dto';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-create-permission',
  standalone: true,
  imports: [ButtonModule, CustomInputComponent, DialogModule, ReactiveFormsModule],
  templateUrl: './create-permission.component.html',
  styles: [],
})
export class CreatePermissionComponent {
  private userService = inject(UserService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      codename: ['', Validators.required],
    });
  }

  createPermissionMutation = injectMutation(() => ({
    mutationFn: async (permissionDto: PermissionDto) =>
      this.userService.createPermission(permissionDto),
    onSuccess: async () => {
      toast.success('Permiso creado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['permissions'],
      });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    console.log(this.form.value);

    if (this.form.invalid) {
      return;
    }

    await this.createPermissionMutation.mutateAsync(this.form.value);
    this.visible.set(false);
  }
}
