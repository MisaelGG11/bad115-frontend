import { Component, Input, OnChanges, SimpleChanges, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { UserService } from '../../../../../services/user.service';
import { Role } from '../../../../../interfaces/user.interface';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-delete-role',
  standalone: true,
  imports: [ButtonModule, DialogModule],
  templateUrl: './delete-role.component.html',
  styles: ``,
})
export class DeleteRoleComponent {
  private userService = inject(UserService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() role!: Role;

  deleteRoleMutation = injectMutation(() => ({
    mutationFn: async () => this.userService.deleteRole(this.role.id),
    onSuccess: async () => {
      toast.success('Rol eliminado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
    },
  }));

  async delete() {
    await this.deleteRoleMutation.mutateAsync();
    this.visible.set(false);
  }
}
