import { Component } from '@angular/core';
import { JobApplicationsListComponent } from './components/job-applications-list/job-applications-list.component';

@Component({
  selector: 'app-job-application-management',
  standalone: true,
  imports: [JobApplicationsListComponent],
  templateUrl: './job-application-management.component.html',
  styles: ``,
})
export class JobApplicationManagementComponent {}
