import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './footer-dashboard.component.html',
})
export class FooterDashboardComponent {
  date = new Date().getFullYear();
}
