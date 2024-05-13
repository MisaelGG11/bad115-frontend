import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserDropdownComponent } from '../dropdowns/user-dropdown/user-dropdown.component';
import { NotificationDropdownComponent } from '../dropdowns/notification-dropdown/notification-dropdown.component';
import { Route } from '../../interfaces/route';
import { Store } from '@ngrx/store';
import { Session } from '../../interfaces/user';
import { PERMISSIONS, ROLES } from '../../utils/constants.utils';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    UserDropdownComponent,
    NotificationDropdownComponent,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  router = inject(Router);
  store = inject(Store);
  sessionValue: Session | undefined;
  permissions: string[] = [];
  roles: string[] = [];
  routes: Route[] = [];

  constructor() {
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
    });

    this.permissions = this.sessionValue?.user?.permissions ?? [];
    this.roles = this.sessionValue?.user?.roles ?? [];

    this.configureRoute();
  }

  collapseShow = 'hidden';

  toggleCollapseShow(classes: string) {
    this.collapseShow = classes;
  }

  configureRoute() {
    if (!this.roles.includes(ROLES.ADMIN)) {
      this.routes = [
        { name: 'Perfil', path: '/dashboard/perfil', icon: 'fa fa-user' },
        {
          name: 'Experiencia Laboral',
          path: '/dashboard/experiencia-laboral',
          icon: 'fa fa-briefcase',
        },
        {
          name: 'Educación',
          path: '/dashboard/educacion',
          icon: 'fa fa-graduation-cap',
        },
        {
          name: 'Certificaciones y logros',
          path: '/dashboard/certificaciones-logros',
          icon: 'fa fa-trophy',
        },
        {
          name: 'Habilidades',
          path: '/dashboard/habilidades',
          icon: 'fa fa-handshake',
        },
      ];
    }

    if (this.permissions.includes(PERMISSIONS.MANAGE_USER)) {
      this.routes.push(
        {
          name: 'Gestión de usuarios',
          path: '/dashboard/usuarios',
          icon: 'fa fa-users',
        },
        {
          name: 'Desbloqueo de usuarios',
          path: '/dashboard/desbloqueo-usuarios',
          icon: 'fa fa-user-lock',
        },
      );
    }

    if (this.permissions.includes(PERMISSIONS.MANAGE_ROLE)) {
      this.routes.push({
        name: 'Gestión de roles',
        path: '/dashboard/roles',
        icon: 'fa fa-user-tag',
      });
    }

    if (this.permissions.includes(PERMISSIONS.MANAGE_PERMISSION)) {
      this.routes.push({
        name: 'Gestión de permisos',
        path: '/dashboard/permisos',
        icon: 'fa fa-key',
      });
    }

    if (this.permissions.includes(PERMISSIONS.MANAGE_CATALOG)) {
      this.routes.push({
        name: 'Gestión de catálogos',
        path: '/dashboard/catalogos',
        icon: 'fa fa-book',
      });
    }
  }
}
