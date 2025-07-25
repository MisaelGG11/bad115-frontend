import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Session } from '../../interfaces/user.interface';
import { CardMenu } from '../../interfaces/route.interface';
import { PERMISSIONS, ROLES } from '../constants.utils';

@Injectable({
  providedIn: 'root',
})
export class GlobalFunctionsService {
  private store = inject(Store);
  sessionValue!: Session;
  permissions: WritableSignal<string[]> = signal([]);
  roles: WritableSignal<string[]> = signal([]);

  constructor() {
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
      this.permissions.set(session?.user?.permissions);
      this.roles.set(session?.user?.roles);
    });
  }

  verifyPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  getRoles(): string[] {
    return this.roles();
  }

  getPermissions(): string[] {
    return this.permissions();
  }

  getMenu(sidebar: boolean): CardMenu[] {
    let routes: CardMenu[] = [];
    if (!this.roles().includes(ROLES.ADMIN)) {
      if (this.roles().includes(ROLES.USER)) {
        routes = [
          {
            name: 'Perfil',
            path: '/dashboard/perfil',
            icon: sidebar ? 'fa fa-user' : 'person',
            description: 'Ver y editar tu perfil',
            color: 'text-blue-500',
          },
          {
            name: 'Experiencia Laboral',
            path: '/dashboard/experiencia-laboral',
            icon: sidebar ? 'fa fa-briefcase' : 'business_center',
            description: 'Agrega tu experiencia laboral',
            color: 'text-yellow-900',
          },
          {
            name: 'Educación',
            path: '/dashboard/educacion',
            icon: sidebar ? 'fa fa-graduation-cap' : 'school',
            description: 'Agrega tu educación y tus estudios',
            color: 'text-green-500',
          },
          {
            name: 'Certificaciones y logros',
            path: '/dashboard/certificaciones-logros',
            icon: sidebar ? 'fa fa-trophy' : 'trophy',
            description:
              'Agrega tus certificaciones, reconocimientos, participación en eventos y publicaciones',
            color: 'text-yellow-300',
          },
          {
            name: 'Habilidades',
            path: '/dashboard/habilidades',
            icon: sidebar ? 'fa fa-handshake' : 'handshake',
            description: 'Agrega tus habilidades técnicas y lingüísticas',
            color: 'text-red-500',
          },
          {
            name: 'Red TalentHub',
            path: '/dashboard/red-talenthub',
            icon: sidebar ? 'fa fa-users' : 'group',
            description: 'Ver la red de usuarios y empleos de TalentHub',
            color: 'text-blue-500',
          },
          {
            name: 'Vacantes aplicadas',
            path: '/dashboard/vacantes-aplicadas',
            icon: sidebar ? 'fa fa-file-alt' : 'description',
            description: 'Ver las vacantes a las que has aplicado',
            color: 'text-yellow-500',
          },
        ];
      }
    }

    if (this.permissions().includes(PERMISSIONS.MANAGE_USER)) {
      routes.push(
        {
          name: 'Gestión de usuarios',
          path: '/dashboard/usuarios',
          icon: sidebar ? 'fa fa-users' : 'group',
          description: 'Gestiona los usuarios de la plataforma',
          color: 'text-blue-500',
        },
        {
          name: 'Desbloqueo de usuarios',
          path: '/dashboard/desbloqueo-usuarios',
          icon: sidebar ? 'fa fa-user-lock' : 'account_circle_off',
          description: 'Desbloquea a los usuarios que han sido bloqueados',
          color: 'text-yellow-500',
        },
      );
    }

    if (this.permissions().includes(PERMISSIONS.MANAGE_ROLE)) {
      routes.push({
        name: 'Gestión de roles',
        path: '/dashboard/roles',
        icon: sidebar ? 'fa fa-user-tag' : 'manage_accounts',
        description: 'Gestiona los roles de la plataforma',
        color: 'text-green-500',
      });
    }

    if (this.permissions().includes(PERMISSIONS.MANAGE_PERMISSION)) {
      routes.push({
        name: 'Gestión de permisos',
        path: '/dashboard/permisos',
        icon: sidebar ? 'fa fa-key' : 'key',
        description: 'Gestiona los permisos de la plataforma',
        color: 'text-indigo-500',
      });
    }

    if (this.permissions().includes(PERMISSIONS.MANAGE_CATALOG)) {
      routes.push({
        name: 'Gestión de catálogos',
        path: '/dashboard/catalogos',
        icon: sidebar ? 'fa fa-book' : 'book_2',
        description: 'Gestiona los catálogos de la plataforma',
        color: 'text-red-500',
      });
    }

    if (this.roles().includes(ROLES.COMPANY)) {
      if (this.permissions().includes(PERMISSIONS.READ_COMPANY)) {
        routes.push({
          name: 'Perfil de empresa',
          path: '/dashboard/perfil-empresa',
          icon: sidebar ? 'fa fa-building' : 'business',
          description: 'Ver y editar tu perfil de empresa',
          color: 'text-blue-500',
        });
      }

      if (this.permissions().includes(PERMISSIONS.UPDATE_COMPANY)) {
        routes.push({
          name: 'Gestión de reclutadores',
          path: '/dashboard/reclutadores-empresa',
          icon: sidebar ? 'fa fa-user-tie' : 'engineering',
          description: 'Gestiona los reclutadores de tu empresa',
          color: 'text-yellow-500',
        });
      }
    }
    if (
      this.permissions().includes(PERMISSIONS.MANAGE_JOB) &&
      !this.roles().includes(ROLES.ADMIN)
    ) {
      routes.push({
        name: 'Puestos de empresa',
        path: '/dashboard/puestos-empresa',
        icon: sidebar ? 'fa fa-building' : 'business_center',
        description: 'Gestiona las vacantes de tu empresa',
        color: 'text-indigo-500',
      });
    }

    return routes;
  }
}
