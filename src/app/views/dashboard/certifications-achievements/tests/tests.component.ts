import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TestsListComponent } from './components/tests-list/tests-list.component';
import { CreateTestComponent } from './components/create-test/create-test.component';
import { EditTestComponent } from './components/edit-test/edit-test.component';
import { DeleteTestComponent } from './components/delete-test/delete-test.component';

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [
    ButtonModule,
    TestsListComponent,
    CreateTestComponent,
    EditTestComponent,
    DeleteTestComponent,
  ],
  templateUrl: './tests.component.html',
  styles: ``,
})
export class TestsComponent {
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedTest = signal('');

  showAddDialog() {
    this.showAddModal.set(true);
  }

  showEditDialog(certificationId: string) {
    this.selectedTest.set(certificationId);
    this.showEditModal.set(true);
  }

  showDeleteDialog(certificationId: string) {
    this.selectedTest.set(certificationId);
    this.showDeleteModal.set(true);
  }
}
