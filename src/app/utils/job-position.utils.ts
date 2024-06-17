export const modalityOptionsJobPosition: Array<{
  label: string;
  value: string | { name: string };
}> = [
  { label: 'Presencial', value: 'ON_SITE' },
  { label: 'Remoto', value: 'REMOTE' },
  { label: 'Hibrido', value: 'HYBRID' },
];
export const contractOptionsJobPosition: Array<{
  label: string;
  value: string | { name: string };
}> = [
  { label: 'Practicante', value: 'INTERNSHIP' },
  { label: 'Temporal', value: 'TEMPORARY' },
  { label: 'Contratista', value: 'CONTRACTOR' },
  { label: 'Permanente', value: 'PERMANENT' },
  { label: 'Voluntario', value: 'VOLUNTEER' },
  { label: 'Por proyecto', value: 'BY_PROJECT' },
];
export const experienceOptionsJobPosition: Array<{
  label: string;
  value: string | { name: string };
}> = [
  { label: 'Menos de 1 año', value: 'LESS_ONE_YEAR' },
  { label: '1 a 3 años', value: 'ONE_TO_THREE_YEARS' },
  { label: '3 a 5 años', value: 'THREE_TO_FIVE_YEARS' },
  { label: 'Más de 5 años', value: 'MORE_FIVE_YEARS' },
];
export const workDayOptionsJobPosition: Array<{ label: string; value: string | { name: string } }> =
  [
    { label: 'Tiempo completo', value: 'FULL_TIME' },
    { label: 'Medio tiempo', value: 'PART_TIME' },
    { label: 'Intermitente', value: 'INTERMITTENT' },
  ];
export const languageLevelOptionsJobPosition: Array<{
  label: string;
  value: string | { name: string };
}> = [
  { label: 'A1', value: 'A1' },
  { label: 'A2', value: 'A2' },
  { label: 'B1', value: 'B1' },
  { label: 'B2', value: 'B2' },
  { label: 'C1', value: 'C1' },
  { label: 'C2', value: 'C2' },
];
export const skillsOptionsJobPosition: Array<{ label: string; value: string | { name: string } }> =
  [
    { label: 'Escucha', value: 'Escucha' },
    { label: 'Lectura', value: 'Lectura' },
    { label: 'Escritura', value: 'Escritura' },
    { label: 'Conversación', value: 'Conversación' },
  ];
