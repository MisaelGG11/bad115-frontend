import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Session } from '../../../interfaces/user.interface';
import { createPopper } from '@popperjs/core';
import { logout } from '../../../store/auth.actions';
import { Router } from '@angular/router';
import { map, Observable, shareReplay, timer } from 'rxjs';
import { CandidateService } from '../../../services/candidate.service';
import { getPersonLocalStorage } from '../../../utils/person-local-storage.utils';
import { saveFile } from '../../../utils/file.utils';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './user-dropdown.component.html',
})
export class UserDropdownComponent implements AfterViewInit {
  dropdownPopoverShow = false;
  private store = inject(Store);
  private router = inject(Router);
  private candidateService = inject(CandidateService);
  sessionValue: Session | undefined;
  person = getPersonLocalStorage();

  private _time$: Observable<Date> = timer(0, 1000).pipe(
    map(() => new Date()),
    shareReplay(1),
  );

  @ViewChild('btnDropdownRef', { static: false }) btnDropdownRef!: ElementRef | undefined;
  @ViewChild('popoverDropdownRef', { static: false })
  popoverDropdownRef!: ElementRef;
  constructor() {
    this.btnDropdownRef = undefined;
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
    });
  }
  ngAfterViewInit() {
    createPopper(this.btnDropdownRef!.nativeElement, this.popoverDropdownRef.nativeElement, {
      placement: 'bottom',
    });
  }
  toggleDropdown(event: any) {
    event.preventDefault();
    this.dropdownPopoverShow = !this.dropdownPopoverShow;
  }

  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/']);
  }

  async downloadCV() {
    try {
      const buffer = await this.candidateService.downloadCV(this.person.candidateId);
      const filename = `CV - ${this.person.firstName} ${this.person.middleName} ${this.person.lastName} ${this.person.secondLastName}.pdf`;

      saveFile(buffer, filename);
    } catch (error) {
      console.error('Error al descargar CV:', error);
    }
  }

  get time() {
    return this._time$;
  }
}
