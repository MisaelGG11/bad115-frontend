import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validateInitAndFinishDate: ValidatorFn = (
  form: AbstractControl,
): ValidationErrors | null => {
  const currentJob = form.get('currentJob')?.value[0] === 'true';
  const initDate = form.get('initDate');
  const finishDate = form.get('finishDate');

  if (currentJob) {
    finishDate?.setErrors(null);
    return { finishDate: null };
  }

  if (initDate?.value > finishDate?.value) {
    finishDate?.setErrors({ finishDate: 'La fecha finalización debe ser mayor que la inicial' });
    return { finishDate: { finishDate: 'La fecha finalización debe ser mayor que la inicial' } };
  }

  return null;
};
