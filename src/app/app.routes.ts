import { Routes } from '@angular/router';
import { IndexComponent } from './views/index/index.component';

export const routes: Routes = [
    // no layout views
    { path: "", component: IndexComponent },
  ];