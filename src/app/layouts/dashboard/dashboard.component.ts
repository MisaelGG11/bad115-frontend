import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { DashboardNavbarComponent } from '../../components/navbars/dashboard-navbar/dashboard-navbar.component';
import { FooterDashboardComponent } from '../../components/footers/footer-dashboard/footer-dashboard.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderStatsComponent } from '../../components/headers/header-stats/header-stats.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SidebarComponent, DashboardNavbarComponent, FooterDashboardComponent, HeaderStatsComponent],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {

}
