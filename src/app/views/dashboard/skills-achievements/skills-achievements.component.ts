import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { LanguageSkillsComponent } from './language-skills/language-skills.component';
import { TechnicalSkillsComponent } from './technical-skill/technical-skill.component';

@Component({
  selector: 'app-skills-achievements',
  standalone: true,
  imports: [
    TabViewModule,
    LanguageSkillsComponent,
    TechnicalSkillsComponent,
  ],
  templateUrl: './skills-achievements.component.html',
  styles: ``,
})
export class SkillsAchievementsComponent {}