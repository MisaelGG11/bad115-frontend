import {Component} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet} from "@angular/router";
import {filter} from "rxjs";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './auth.component.html',
  styles: ``
})
export class AuthComponent {
  footerLinks: Array<{ label: string; link: string; }> = []

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const route = this?.activatedRoute?.snapshot?.firstChild?.routeConfig?.path ?? undefined;
      switch (route) {
        case 'login':
          this.footerLinks = [
            {label: 'Desbloquear usuario', link: '/auth/unblock-user'},
            {label: 'Crea una nueva cuenta', link: '/auth/registro'}
          ]
          break;
        case 'registro':
          this.footerLinks = [
            {label: 'Iniciar sesión', link: '/auth/login'},
            {label: 'Desbloquear usuario', link: '/auth/unblock-user'},
          ]
          break;
        case 'unblock-user':
          this.footerLinks = [
            {label: 'Iniciar sesión', link: '/auth/login'},
            {label: 'Crea una nueva cuenta', link: '/auth/registro'}
          ]
          break;
        default:
          break;
      }
    });
  }
}
