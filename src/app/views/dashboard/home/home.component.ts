import { Component } from '@angular/core';
import { toast } from 'ngx-sonner';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
  ],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {
  protected readonly toast = toast;

  value: string = '';
  date2: string = '';
}
