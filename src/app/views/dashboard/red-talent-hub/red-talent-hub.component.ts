import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { JobPositionCandidatesComponent } from './components/job-position-candidates/job-position-candidates.component';
import { CandidatesListComponent } from './components/candidates-list/candidates-list.component';

@Component({
  selector: 'app-red-talent-hub',
  standalone: true,
  imports: [TabViewModule, JobPositionCandidatesComponent, CandidatesListComponent],
  templateUrl: './red-talent-hub.component.html',
  styles: ``,
})
export class RedTalentHubComponent {}
