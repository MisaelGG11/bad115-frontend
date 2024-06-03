import { Component, Input, OnChanges, SimpleChanges, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { UserService } from '../../../../../services/user.service';
import { Permission } from '../../../../../interfaces/user.interface';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-delete-permission',
  standalone: true,
  imports: [ButtonModule, DialogModule],
  templateUrl: './delete-permission.component.html',
  styles: ``,
})
export class DeletePermissionComponent {
  private userService = inject(UserService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() permission!: Permission;

  deletePermissionMutation = injectMutation(() => ({
    mutationFn: async () => this.userService.deletePermission(this.permission.id),
    onSuccess: async () => {
      toast.success('Permiso eliminado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['permissions'],
      });
    },
  }));

  async delete() {
    await this.deletePermissionMutation.mutateAsync();
    this.visible.set(false);
  }
}
