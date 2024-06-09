import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { CandidateDetails } from '../../../interfaces/candidate.interface';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../../../services/candidate.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import { CreateRecommendationComponent } from './components/create-recommendation/create-recommendation.component';
import { EditRecommendationComponent } from './components/edit-recommendation/edit-recommendation.component';
import { DeleteRecommendationComponent } from './components/delete-recommendation/delete-recommendation.component';
import { getPersonLocalStorage } from '../../../utils/local-storage.utils';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    SpinnerComponent,
    CreateRecommendationComponent,
    EditRecommendationComponent,
    DeleteRecommendationComponent,
  ],
  templateUrl: './candidate-profile.component.html',
  styles: ``,
})
export class CandidateProfileComponent {
  private route = inject(ActivatedRoute);
  private candidateService = inject(CandidateService);
  @Input() candidateId = this.route.snapshot.params['candidateId'];
  profile!: CandidateDetails;
  person = getPersonLocalStorage();
  showAddRecommendationModal = signal(false);
  showEditRecommendationModal = signal(false);
  showDeleteRecommendationModal = signal(false);
  currentUser = this.person.candidateId === this.candidateId;
  hasAlreadyRecommended = false;

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['candidateId'] && !changes['candidateId'].isFirstChange()) {
      await this.candidateRequest.refetch();
      this.currentUser = this.person.candidateId === this.candidateId;
    }
  }

  candidateRequest = injectQuery(() => ({
    queryKey: ['candidates', { candidateId: this.candidateId }],
    queryFn: async () => {
      this.hasAlreadyRecommended = false;
      this.profile = await this.candidateService.getCandidate(this.candidateId);
      this.profile.recomendations.forEach((recommendation) => {
        if (recommendation.users[0].id === this.person.userId) {
          this.hasAlreadyRecommended = true;
        }
      });
      console.log(this.hasAlreadyRecommended);
      return this.profile;
    },
    enabled: !!this.candidateId,
  }));

  showAddRecommendationDialog(): void {
    this.showAddRecommendationModal.set(true);
  }

  showEditRecommendationDialog(): void {
    this.showEditRecommendationModal.set(true);
  }

  showDeleteRecommendationDialog(): void {
    this.showDeleteRecommendationModal.set(true);
  }

  handleIcon = (socialMedia: string) => {
    switch (socialMedia.toLocaleLowerCase()) {
      case 'facebook':
        return 'fa-brands fa-facebook';
      case 'twitter':
        return 'fa-brands fa-x-twitter';
      case 'instagram':
        return 'fa-brands fa-instagram';
      case 'linkedin':
        return 'fa-brands fa-linkedin';
      case 'snapchat':
        return 'fa-brands fa-snapchat';
      case 'pinterest':
        return 'fa-brands fa-pinterest';
      case 'reddit':
        return 'fa-brands fa-reddit';
      case 'tiktok':
        return 'fa-brands fa-tiktok';
      case 'youtube':
        return 'fa-brands fa-youtube';
      case 'wechat':
        return 'fa-brands fa-weixin';
      case 'tumblr':
        return 'fa-brands fa-tumblr';
      case 'viber':
        return 'fa-brands fa-viber';
      case 'slack':
        return 'fa-brands fa-slack';
      case 'discord':
        return 'fa-brands fa-discord';
      case 'github':
        return 'fa-brands fa-github';
      default:
        return 'fa-solid fa-hashtag';
    }
  };

  handleColor = (socialMedia: string) => {
    switch (socialMedia.toLocaleLowerCase()) {
      case 'facebook':
        return '#1877f2';
      case 'twitter':
        return '#1da1f2';
      case 'instagram':
        return '#c13584';
      case 'linkedin':
        return '#0a66c2';
      case 'snapchat':
        return '#ffC000';
      case 'pinterest':
        return '#bd081c';
      case 'reddit':
        return '#ff4500';
      case 'tiktok':
        return '#000000';
      case 'youtube':
        return '#ff0000';
      case 'wechat':
        return '#7bb32e';
      case 'tumblr':
        return '#36465d';
      case 'viber':
        return '#665cac';
      case 'slack':
        return '#4a154b';
      case 'discord':
        return '#7289da';
      default:
        return '#000000';
    }
  };
}
