import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent } from '../../../../components/inputs/custom-input/custom-input.component';
import { DialogModule } from 'primeng/dialog';
import { PickListModule } from 'primeng/picklist';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { UserService } from '../../../../services/user.service';
import { RoleDto } from '../../../../services/interfaces/user.dto';
import { Role, Permission } from '../../../../interfaces/user.interface';
import { PermissionTemplateComponent } from './components/permission-template/permission-template.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [
    ButtonModule,
    CustomInputComponent,
    DialogModule,
    PickListModule,
    ReactiveFormsModule,
    PermissionTemplateComponent,
  ],
  templateUrl: './edit-role.component.html',
  styles: [],
})
export class EditRoleComponent {
  private userService = inject(UserService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() readOnly = signal(false);
  @Input() role!: Role;
  form: FormGroup;
  availablePermissionsOptions: Permission[] = [];
  rolPermissions: Permission[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      permissionIds: [[]],
    });
  }

  permissionsRequest = injectQuery(() => ({
    queryKey: ['permisssions_role'],
    queryFn: async () => {
      const data = await this.userService.findPermissions();
      this.addPermissionsOptions(data);
      return data;
    },
  }));

  addPermissionsOptions(permissions: Permission[]) {
    const permissionsIds = this.rolPermissions.map((permission) => permission.id);
    this.availablePermissionsOptions = permissions.filter(
      (permission) => !permissionsIds.includes(permission.id),
    );
    console.log(this.availablePermissionsOptions);
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['role'] && !changes['role'].isFirstChange()) {
      this.form.patchValue({
        name: this.role.name,
      });
      this.rolPermissions = this.role.permissions;
    }
    this.permissionsRequest.refetch();
  }

  editRoleMutation = injectMutation(() => ({
    mutationFn: async (permissions: string[]) =>
      this.userService.updateRole(this.role.id, permissions),
    onSuccess: async () => {
      toast.success('Rol actualizado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    this.form.patchValue({
      permissionIds: this.rolPermissions.map((permission) => permission.id),
    });

    if (this.form.invalid) {
      return;
    }
    await this.editRoleMutation.mutateAsync(this.form.value.permissionIds);
    this.role = {} as Role;
    this.visible.set(false);
  }
}
