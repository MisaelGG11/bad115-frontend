import { Component } from '@angular/core';
import { RecognitionTypeListComponent } from './components/recogtion-type-list/recognition-type-list.component';

@Component({
  selector: 'app-recognition-type',
  standalone: true,
  imports: [RecognitionTypeListComponent],
  templateUrl: './recognition-type.component.html',
  styles: [],
})
export class RecognitionTypeComponent {}
