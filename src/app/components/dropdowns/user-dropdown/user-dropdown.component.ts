import { CommonModule } from "@angular/common";
import { Component, AfterViewInit, ViewChild, ElementRef, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { Session } from '../../../interfaces/user';
import { createPopper } from "@popperjs/core";
import { logout } from '../../../store/auth.actions';
import { Router } from "@angular/router";

@Component({
  selector: "app-user-dropdown",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./user-dropdown.component.html",
})
export class UserDropdownComponent implements AfterViewInit {
  dropdownPopoverShow = false;
  private store = inject(Store);
  private router = inject(Router);
  sessionValue: Session | undefined;

  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef!: ElementRef | undefined;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef!: ElementRef;
  constructor() {
    this.btnDropdownRef = undefined;
    this.store.select('session').subscribe((session) => {
    this.sessionValue = session
    })
  }
  ngAfterViewInit() {
    createPopper(
      this.btnDropdownRef!.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }
  toggleDropdown(event: any) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
    }
  }

  logout() {
    this.store.dispatch(logout())
    this.router.navigate(['/'])
  }
}
