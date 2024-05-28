import { Component, Input, forwardRef } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputErrorsComponent } from '../input-errors/input-errors.component';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [DropdownModule, ReactiveFormsModule, CommonModule, FormsModule, InputErrorsComponent],
  templateUrl: './select.component.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent {
  public value: string | number = '';
  public changed: (value: string | number) => void = () => {};
  public touched: () => void = () => {};

  @Input() parentForm: FormGroup | null = null;
  @Input() fieldName: string = '';
  @Input() selectOptions: Array<any> = [];
  @Input() isDisabled: boolean = false;
  @Input() rounded: string = 'lg';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() filter: boolean = false;
  @Input() filterBy: string = 'label';
  @Input() loading: boolean = false;

  public writeValue(value: string): void {
    this.value = value;
  }

  get formField(): FormControl {
    return this.parentForm?.get(this.fieldName) as FormControl;
  }

  public onChange(event: any): void {
    const value: string | number = event.value;
    this.changed(value);
  }

  public registerOnChange(fn: any): void {
    this.changed = fn;
  }

  public registerOnTouched(fn: any): void {
    this.touched = fn;
  }
}
