import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 *
 * @description This function is used to validate that the finish date is greater than the initial date
 * @param form Form group
 *
 */
export const validateFileInput: ValidatorFn = (
  form: AbstractControl,
): ValidationErrors | null => {
  const file = form.get('file') as FormControl;
  const maxSize = 10 * 1024 * 1024; // 10MB

  if(file?.value) {
    // Se válida el tamaño del archivo
    if (file?.value?.size > maxSize) {
      file?.setErrors({ file: 'El archivo no debe pesar mas de 10Mb' });
      return { file: 'El archivo no debe pesar mas de 10Mb' };
    }

    // Valida que sea un pdf
    if (!file?.value?.type.includes('pdf')) {
      file?.setErrors({ file: 'El archivo debe ser un PDF' });
      return { file: 'El archivo debe ser un PDF' };
    }
  }

  return null;
};
