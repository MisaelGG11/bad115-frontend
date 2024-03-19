import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IndexNavbarComponent } from '../../components/navbars/index-navbar/index-navbar.component';

@Component({
  selector: 'app-not_found',
  standalone: true,
  imports: [RouterLink, IndexNavbarComponent],
  templateUrl: './notfound.component.html',
  styles: '',
})
export class NotFoundComponent {}
