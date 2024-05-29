import { Component, Input } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Permission } from '../../../../../../interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permission-template',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './permission-template.component.html',
  styles: ``,
})
export class PermissionTemplateComponent {
  @Input() permission!: Permission;
}
