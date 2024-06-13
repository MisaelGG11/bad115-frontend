import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { JobPositionCandidatesComponent } from '../job-position-candidates/job-position-candidates.component';
import { CertificationsComponent } from '../certifications-achievements/certifications/certifications.component';

@Component({
  selector: 'app-red-talent-hub',
  standalone: true,
  imports: [TabViewModule, JobPositionCandidatesComponent, CertificationsComponent],
  templateUrl: './red-talent-hub.component.html',
  styles: ``,
})
export class RedTalentHubComponent {}
