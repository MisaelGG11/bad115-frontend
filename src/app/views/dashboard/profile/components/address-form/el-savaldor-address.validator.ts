import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const elSalvadorAddressValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const countryName = control.get('countryName');
  const departmentId = control.get('departmentId');
  const municipalityId = control.get('municipalityId');

  return countryName &&
    countryName.value === 'El Salvador' &&
    (!departmentId?.value || !municipalityId?.value)
    ? { 'elSalvadorAddressRequired': true }
    : null;
};
