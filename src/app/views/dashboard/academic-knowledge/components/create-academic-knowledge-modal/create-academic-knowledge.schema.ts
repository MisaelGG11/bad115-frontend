import * as Joi from '@hapi/joi';

export const createAcademicKnowledgeSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  organizationName: Joi.string().required(),
  initDate: Joi.date().required().less('now'),
  finishDate: Joi.when('currentJob', {
    is: (value: Array<string>) => value[0] === 'true',
    then: Joi.optional(),
    otherwise: Joi.date().required().greater(Joi.ref('initDate')),
  }),
}).messages({
  'string.empty': 'El campo no puede estar vacío',
  'string.required': 'El campo es requerido',
  'date.base': 'El campo debe ser una fecha válida',
  'date.less':
    'La fecha de inicio no puede ser mayor que la fecha de finalización o la fecha actual',
  'date.greater': 'La fecha de finalización no puede ser menor que la fecha de inicio',
  'boolean.base': 'El campo debe ser verdadero o falso',
  'any.required': 'El campo es requerido',
});
