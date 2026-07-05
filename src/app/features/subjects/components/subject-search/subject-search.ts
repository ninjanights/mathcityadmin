import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subject-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './subject-search.html'
})
export class SubjectSearch {
  value = '';
  searchChanged = output<string>();
}