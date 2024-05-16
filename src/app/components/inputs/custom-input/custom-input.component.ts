import { Component, Input, forwardRef } from '@angular/core';
import {
  Form,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputErrorsComponent } from '../input-errors/input-errors.component';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputErrorsComponent],
  templateUrl: './custom-input.component.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent {
  public value: string = '';
  public changed: (value: string) => void = () => {};
  public touched: () => void = () => {};

  // Input properties
  @Input() parentForm: FormGroup | null = null;
  @Input() isDisabled: boolean = false;
  @Input() fieldName: string = '';
  @Input() placeholder: string = '';
  @Input() prependIcon: string | null = null;
  @Input() endIcon: string | null = null;
  @Input() type: string = 'text';
  @Input() rounded: string = 'lg';
  @Input() label: string = '';
  @Input() required: boolean = false;

  // Internal state variable
  showPassword = false;

  constructor() {}

  // Computed property for input class
  get inputClass() {
    const classes = ['input-group--field'];
    if (this.prependIcon) classes.push('pl-12');
    if (this.endIcon) classes.push('pr-12');
    if (this.rounded) {
      if (this.rounded === 'full') classes.push('rounded-full');
      else classes.push(`rounded-${this.rounded}`);
    }
    if (!this.prependIcon && !this.endIcon) classes.push('px-6');
    return classes.join(' ');
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  public writeValue(value: string): void {
    this.value = value;
  }

  get formField(): FormControl {
    return this.parentForm?.get(this.fieldName) as FormControl;
  }

  public onChange(event: Event): void {
    const value: string = (<HTMLInputElement>event.target).value;

    this.changed(value);
  }

  public registerOnChange(fn: any): void {
    this.changed = fn;
  }

  public registerOnTouched(fn: any): void {
    this.touched = fn;
  }
}
