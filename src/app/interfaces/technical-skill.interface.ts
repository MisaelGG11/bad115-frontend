export interface CatalogTechnicalSkill {
  id: string;
  name: string;
  technicalSkill?: TechnicalSkill[];
}

export interface TechnicalSkill {
  id: string;
  name: string;
  categoryTechnicalSkillId: string;
  categoryTechnicalSkill?: CatalogTechnicalSkill;
}
