export interface Category {
  id: string;
  name: string;
}

export interface TechnicalSkill {
  map(
    arg0: (techincialSkill: TechnicalSkill) => { label: string; value: string },
  ): { label: string; value: string }[];
  id: string;
  name: string;
  cateforyTechnicalSkillId: string;
}
