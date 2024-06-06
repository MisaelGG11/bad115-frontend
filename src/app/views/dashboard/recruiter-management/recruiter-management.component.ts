import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RecruiterListComponent } from './components/recruiter-list/recruiter-list.component';
import { AssignRecruiterComponent } from './components/assign-recruiter/assign-recruiter.component';
import { getCompanyLocalStorage } from '../../../utils/local-storage.utils';

@Component({
  selector: 'app-recruiter-management',
  standalone: true,
  imports: [ButtonModule, RecruiterListComponent, AssignRecruiterComponent],
  templateUrl: './recruiter-management.component.html',
  styles: [],
})
export class RecruiterManagementComponent {
  company = getCompanyLocalStorage();
  showAddModal = signal(false);

  onClickCreate() {
    this.showAddModal.set(true);
  }
}
