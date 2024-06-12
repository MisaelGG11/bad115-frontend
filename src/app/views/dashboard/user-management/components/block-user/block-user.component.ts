import { Component, inject, Input, signal } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { UserService } from '../../../../../services/user.service';
import { User } from '../../../../../interfaces/user.interface';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-block-user',
  standalone: true,
  imports: [ButtonModule, DialogModule],
  templateUrl: './block-user.component.html',
})
export class BlockUserComponent {
  private userService = inject(UserService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() user!: User;

  userRequest = injectQuery(() => ({
    queryKey: ['users', { id: this.user?.id }],
    queryFn: async () => await this.userService.findOneUser(this.user.id),
    enabled: !!this.user,
  }));

  blockUserMutation = injectMutation(() => ({
    mutationFn: async () => this.userService.blockUser(this.user.id),
    onSuccess: async () => {
      toast.success('Usuario bloqueado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  }));

  async block() {
    await this.blockUserMutation.mutateAsync();
    this.visible.set(false);
  }
}
