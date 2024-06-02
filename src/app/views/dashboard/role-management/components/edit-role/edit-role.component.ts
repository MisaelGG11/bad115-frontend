import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { DialogModule } from 'primeng/dialog';
import { PickListModule } from 'primeng/picklist';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { UserService } from '../../../../../services/user.service';
import { AuthService } from '../../../../../services/auth.service';
import { Store } from '@ngrx/store';
import { resetState } from '../../../../../store/auth.actions';
import { Role, Permission } from '../../../../../interfaces/user.interface';
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
  styles: `
    :host ::ng-deep .p-picklist .p-picklist-list .p-picklist-item {
      padding: 0.2rem;
    }
    :host ::ng-deep .p-picklist .p-picklist-filter-container {
      padding: 0.8rem;
    }
    :host ::ng-deep .p-picklist .p-picklist-filter-container .p-picklist-filter-input {
      border-color: white;
      color: #1a202c;
      placeholder-color: #cbd5e0;
      padding-left: 12px;
      padding-right: 36px;
      padding-top: 12px;
      padding-bottom: 12px;
      font-size: 0.875rem;
      border-radius: 0.25rem;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.1),
        0 1px 2px rgba(0, 0, 0, 0.06);
      width: 100%;
    }
    :host ::ng-deep .p-picklist .p-picklist-header {
      padding: 0.8rem;
      text-align: center;
      font-size: 0.9rem;
    }
    :host ::ng-deep .p-button-icon-only {
      background-color: #334155;
      border-color: #334155;
    }
  `,
})
export class EditRoleComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private store = inject(Store);
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
      const { data } = await this.authService.refreshToken(
        localStorage.getItem('refresh_token') ?? '',
      );
      if (data) {
        localStorage.setItem('access_token', data.accessToken);
        this.store.dispatch(resetState());
      }
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
