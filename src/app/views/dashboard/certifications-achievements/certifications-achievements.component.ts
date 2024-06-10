import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ParticipationsComponent } from './participations/participations.component';
import { PublicationsComponent } from './publications/publications.component';
import { RecognitionsComponent } from './recognitions/recognitions.component';
import { CertificationsComponent } from './certifications/certifications.component';
import { TestsComponent } from './tests/tests.component';

@Component({
  selector: 'app-certifications-achievements',
  standalone: true,
  imports: [
    TabViewModule,
    ParticipationsComponent,
    CertificationsComponent,
    PublicationsComponent,
    RecognitionsComponent,
    TestsComponent,
  ],
  templateUrl: './certifications-achievements.component.html',
  styles: ``,
})
export class CertificationsAchievementsComponent {}
