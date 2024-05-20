import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CertificationsListComponent } from './components/certifications-list/certifications-list.component'

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [
    ButtonModule,
    CertificationsListComponent
  ],
  templateUrl: './certifications.component.html',
  styles: ``
})
export class CertificationsComponent {

}
