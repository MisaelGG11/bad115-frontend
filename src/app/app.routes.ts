import { Routes } from '@angular/router';
import { IndexComponent } from './views/index/index.component';
import { LoginComponent } from './views/auth/login/login.component';
import { SignupComponent } from './views/auth/signup/signup.component';

export const routes: Routes = [
    // no layout views
    { path: "", component: IndexComponent },
    { path: "login", component: LoginComponent },
    { path: "registro", component: SignupComponent }
  ];