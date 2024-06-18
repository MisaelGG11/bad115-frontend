import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 *
 * @description This function is used to validate that the finish date is greater than the initial date
 * @param form Form group
 *
 */
export const passwordEnforce: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
  const password = form.get('password') as FormControl;

  // Validar que la password tenga un  mínimo de ocho caracteres, llevar mayúscula, símbolo especial, iniciar con letra, contraseña sensitiva
  const regex = /^(?=.*[A-Z])(?=.*[!@#\$%\^\&*\)\(+=._-])(?=.*[0-9])(?=.{8,})([A-Za-z].*)$/;

  if (!regex.test(password.value)) {
    password?.setErrors({
      password: 'La contraseña no cumple con los requisitos mínimos de seguridad',
    });
    return { password: 'La contraseña debe no cumple con los requisitos mínimos de seguridad' };
  }

  return null;
};
