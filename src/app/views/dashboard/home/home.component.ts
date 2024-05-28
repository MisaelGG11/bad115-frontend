import { Component, inject } from '@angular/core';
import { toast } from 'ngx-sonner';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DataTableComponent } from '../../../components/data-table/data-table.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { getPersonLocalStorage } from '../../../utils/person-local-storage.utils';
import { Router, RouterLink } from '@angular/router';
import { CardMenu } from '../../../interfaces/route.interface';
import { Store } from '@ngrx/store';
import { Session } from '../../../interfaces/user.interface';
import { PERMISSIONS, ROLES } from '../../../utils/constants.utils';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    DataTableComponent,
    TooltipModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {
  protected readonly toast = toast;
  router = inject(Router);
  store = inject(Store);
  sessionValue: Session | undefined;
  permissions: string[] = [];
  roles: string[] = [];
  routes: CardMenu[] = [];
  person = getPersonLocalStorage();

  constructor() {
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
    });
    this.permissions = this.sessionValue?.user?.permissions ?? [];
    this.roles = this.sessionValue?.user?.roles ?? [];
    this.configureRoute();
  }

  configureRoute() {
    if (!this.roles.includes(ROLES.ADMIN)) {
      this.routes = [
        {
          name: 'Perfil',
          path: '/dashboard/perfil',
          icon: 'person',
          description: 'Ver y editar tu perfil',
          color: 'text-blue-500',
        },
        {
          name: 'Experiencia Laboral',
          path: '/dashboard/experiencia-laboral',
          icon: 'business_center',
          description: 'Agrega tu experiencia laboral',
          color: 'text-yellow-900',
        },
        {
          name: 'Educación',
          path: '/dashboard/educacion',
          icon: 'school',
          description: 'Agrega tu educación y tus estudios',
          color: 'text-green-500',
        },
        {
          name: 'Certificaciones y logros',
          path: '/dashboard/certificaciones-logros',
          icon: 'trophy',
          description:
            'Agrega tus certificaciones, reconocimientos, participación en eventos y publicaciones',
          color: 'text-yellow-300',
        },
        {
          name: 'Habilidades',
          path: '/dashboard/habilidades',
          icon: 'handshake',
          description: 'Agrega tus habilidades técnicas y lingüísticas',
          color: 'text-red-500',
        },
      ];
    }

    if (this.permissions.includes(PERMISSIONS.MANAGE_USER)) {
      this.routes.push(
        {
          name: 'Gestión de usuarios',
          path: '/dashboard/usuarios',
          icon: 'group',
          description: 'Gestiona los usuarios de la plataforma',
          color: 'text-blue-500',
        },
        {
          name: 'Desbloqueo de usuarios',
          path: '/dashboard/desbloqueo-usuarios',
          icon: 'account_circle_off',
          description: 'Desbloquea a los usuarios que han sido bloqueados',
          color: 'text-yellow-500',
        },
      );
    }

    if (this.permissions.includes(PERMISSIONS.MANAGE_ROLE)) {
      this.routes.push({
        name: 'Gestión de roles',
        path: '/dashboard/roles',
        icon: 'manage_accounts',
        description: 'Gestiona los roles de la plataforma',
        color: 'text-green-500',
      });
    }

    if (this.permissions.includes(PERMISSIONS.MANAGE_PERMISSION)) {
      this.routes.push({
        name: 'Gestión de permisos',
        path: '/dashboard/permisos',
        icon: 'key',
        description: 'Gestiona los permisos de la plataforma',
        color: 'text-indigo-500',
      });
    }

    if (this.permissions.includes(PERMISSIONS.MANAGE_CATALOG)) {
      this.routes.push({
        name: 'Gestión de catálogos',
        path: '/dashboard/catalogos',
        icon: 'book_2',
        description: 'Gestiona los catálogos de la plataforma',
        color: 'text-red-500',
      });
    }
  }
}
