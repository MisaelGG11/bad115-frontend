import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { DashboardNavbarComponent } from '../../components/navbars/dashboard-navbar/dashboard-navbar.component';
import { FooterDashboardComponent } from '../../components/footers/footer-dashboard/footer-dashboard.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderStatsComponent } from '../../components/headers/header-stats/header-stats.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    SidebarComponent,
    DashboardNavbarComponent,
    FooterDashboardComponent,
    HeaderStatsComponent,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styles: `
    .scrollbar-hide::-webkit-scrollbar {
      width: 0; /* Ancho 0 para ocultar la scrollbar */
    }

    .scrollbar-hide {
      scrollbar-width: none; /* Firefox */
    }
  `,
})
export class DashboardComponent {
  visible = true;

  handleSidebar(visibility: boolean) {
    this.visible = visibility;
  }
}
