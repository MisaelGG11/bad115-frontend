import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ParticipationsComponent } from './participations/participations.component'
import { PublicationsComponent } from './publications/publications.component'
import { AchievementsComponent } from './achievements/achievements.component'
import { CertificationsComponent } from './certifications/certifications.component'

@Component({
  selector: 'app-certifications-achievements',
  standalone: true,
  imports: [TabViewModule, ParticipationsComponent, CertificationsComponent, PublicationsComponent, AchievementsComponent],
  templateUrl: './certifications-achievements.component.html',
  styles: ``
})
export class CertificationsAchievementsComponent {

}
