import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { format } from 'date-fns';
import { Person } from '../../../../../../../interfaces/person.interface';
import { getPersonLocalStorage } from '../../../../../../../utils/local-storage.utils';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { PersonService } from '../../../../../../../services/person.service';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from '../../../../../../../components/spinner/spinner.component';

@Component({
  selector: 'app-social-media-list',
  standalone: true,
  imports: [CardModule, DatePipe, TooltipModule, ButtonModule, SpinnerComponent, CommonModule],
  templateUrl: './social-media-list.component.html',
  styles: ``,
})
export class SocialMediaListComponent {
  private personService = inject(PersonService);
  private person: Person = getPersonLocalStorage();
  @Output() showDeleteDialog = new EventEmitter<string>();
  @Output() showEditDialog = new EventEmitter<string>();

  icon = '';
  color = signal('');

  constructor() {}

  allSocialMediaRequest = injectInfiniteQuery(() => ({
    queryKey: ['socialMedia', { personId: this.person.id }],
    queryFn: ({ pageParam }) =>
      this.personService.getAllSocialMedia(this.person.id, {
        page: pageParam,
        perPage: 6,
      }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    maxPages: 3,
  }));

  #hasNextPage = this.allSocialMediaRequest.hasNextPage;
  #isFetchingNextPage = this.allSocialMediaRequest.isFetchingNextPage;

  nextButtonDisabled = computed(() => !this.#hasNextPage() || this.#isFetchingNextPage());
  nextButtonText = computed(() =>
    this.#isFetchingNextPage()
      ? 'Cargando...'
      : this.#hasNextPage()
        ? 'Cargar más'
        : 'No hay más registros',
  );

  onClickShowEditDialog(socialMediaId: string) {
    this.showEditDialog.emit(socialMediaId);
  }

  onClickShowDeleteDialog(socialMediaId: string) {
    this.showDeleteDialog.emit(socialMediaId);
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
