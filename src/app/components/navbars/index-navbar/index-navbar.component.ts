import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-index-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './index-navbar.component.html',
})
export class IndexNavbarComponent {
  navbarOpen = false;

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }
}
