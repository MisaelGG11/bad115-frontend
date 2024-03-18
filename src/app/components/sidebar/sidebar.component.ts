import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { UserDropdownComponent } from "../dropdowns/user-dropdown/user-dropdown.component";
import { NotificationDropdownComponent } from "../dropdowns/notification-dropdown/notification-dropdown.component";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, UserDropdownComponent, NotificationDropdownComponent],
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent {
  collapseShow = "hidden";

  toggleCollapseShow(classes: string) {
    this.collapseShow = classes;
  }
}
