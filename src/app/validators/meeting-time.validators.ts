import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 *
 * @description This function is used to validate that the finish date is greater than the initial date
 * @param form Form group
 *
 */
export const validateMeetingTime: ValidatorFn = (
  form: AbstractControl,
): ValidationErrors | null => {
  const meetingDateTime = form.get('executionDate') as FormControl;

  // Validar que sea entre las 6:00 y las 18:00
  if (meetingDateTime?.value) {
    const date = new Date(meetingDateTime?.value);
    const hour = date.getHours();
    const minutes = date.getMinutes();

    if (hour < 6 || hour >= 18) {
      meetingDateTime?.setErrors({
        executionDate: 'La hora de la reunión debe ser entre las 6:00 y las 18:00',
      });
      return { executionDate: 'La hora de la reunión debe ser entre las 6:00 y las 18:00' };
    }
  }

  return null;
};
