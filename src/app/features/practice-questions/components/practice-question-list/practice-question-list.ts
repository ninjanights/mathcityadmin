import { Component, input, output } from '@angular/core';

import { PracticeQuestionListResponse } from '../../models';

import { PracticeQuestionCard } from '../practice-question-card/practice-question-card';

@Component({
  selector: 'app-practice-question-list',
  standalone: true,
  imports: [PracticeQuestionCard],
  templateUrl: './practice-question-list.html',
})
export class PracticeQuestionList {
  practiceQuestions = input.required<PracticeQuestionListResponse[]>();

  edit = output<PracticeQuestionListResponse>();
  delete = output<PracticeQuestionListResponse>();

  moveUp = output<PracticeQuestionListResponse>();
  moveDown = output<PracticeQuestionListResponse>();
}