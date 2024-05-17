import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as Joi from '@hapi/joi';

type TODO = any;

export function createValidatorFromSchema(schema: Joi.ObjectSchema<any>): ValidatorFn {
  return (group: AbstractControl) => {
    // This is where the validation on the values of
    // the form group is run.
    const result = schema.validate(group.value, { abortEarly: true });

    if (result.error) {
      const errorObj = result.error.details.reduce((acc: TODO, current: TODO) => {
        const key = current.path.join('.');
        acc[key] = current.message;
        return acc;
      }, {});

      // Set error value on each control
      for (const key in errorObj) {
        const control = group.get(key);
        if (control) {
          control.setErrors({ [key]: errorObj[key] });
        }
      }

      // Return the error object so that we can access
      // the form’s errors via `form.errors`.
      return errorObj;
    } else {
      return null;
    }
  };
}

export const joiValidate = (control: AbstractControl, schema: Joi.ObjectSchema<any>) => {
  const result = schema.validate(control.value);
  if (result.error) {
    return result.error.details.reduce((obj, val, key) => {
      // @ts-ignore
      obj[val.type] = val.message;
      return obj;
    }, {});
  }

  return null;
};
