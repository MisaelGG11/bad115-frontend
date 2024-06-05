import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IndexNavbarComponent } from '../../components/navbars/index-navbar/index-navbar.component';
import { FooterComponent } from '../../components/footers/footer/footer.component';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink, IndexNavbarComponent, FooterComponent, DividerModule],
  templateUrl: './index.component.html',
  styles: ``,
})
export class IndexComponent {}
