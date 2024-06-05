import { Component, inject } from '@angular/core';
import { getPersonLocalStorage } from '../../../utils/person-local-storage.utils';
import { Router, RouterLink } from '@angular/router';
import { GlobalFunctionsService } from '../../../utils/services/global-functions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {
  private global = inject(GlobalFunctionsService);
  router = inject(Router);
  routes = this.global.getMenu(false);
  person = getPersonLocalStorage();
}
