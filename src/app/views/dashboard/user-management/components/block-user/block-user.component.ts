import { Component, inject, Input, OnChanges, signal, WritableSignal } from '@angular/core';
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
export class BlockUserComponent implements OnChanges {
  private userService = inject(UserService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() user!: WritableSignal<User | null>;

  userRequest = injectQuery(() => ({
    queryKey: ['users', { id: this.user()?.id }],
    queryFn: async () => await this.userService.findOneUser(this.user()!.id),
    enabled: !!this.user()?.id,
  }));

  blockUserMutation = injectMutation(() => ({
    mutationFn: async () => this.userService.blockUser(this.user()!.id),
    onSuccess: async () => {
      toast.success('Usuario bloqueado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  }));

  async ngOnChanges() {
    await this.userRequest.refetch();
  }

  getUserName() {
    const userName =
      Object.keys(this.userRequest.data()?.person || {}).length > 0
        ? `${this.userRequest.data()?.person.firstName} ${this.userRequest.data()?.person.lastName}`
        : this.userRequest.data()?.company?.name;

    return userName;
  }

  async block() {
    await this.blockUserMutation.mutateAsync();
    this.visible.set(false);
  }
}
