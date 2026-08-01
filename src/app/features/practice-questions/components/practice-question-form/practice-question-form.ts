import {
  Component,
  OnChanges,
  inject,
  input,
  output,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  CreatePracticeQuestionRequest,
  PracticeQuestionResponse,
} from '../../models';

@Component({
  selector: 'app-practice-question-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './practice-question-form.html',
})
export class PracticeQuestionForm implements OnChanges {
  private readonly fb = inject(FormBuilder);

  question = input<PracticeQuestionResponse>();

  lessonId = input.required<string>();

  saving = input(false);

  save = output<CreatePracticeQuestionRequest>();

  cancel = output<void>();

  form = this.fb.group({
    question: ['', Validators.required],

    optionA: ['', Validators.required],
    optionB: ['', Validators.required],
    optionC: ['', Validators.required],
    optionD: ['', Validators.required],

    correctAnswer: [1, Validators.required],

    explanation: ['', Validators.required],

    difficulty: [1, Validators.required],
  });

  ngOnChanges(): void {
    const question = this.question();

    if (question) {
      this.form.patchValue({
        question: question.question,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        difficulty: question.difficulty,
      });

      return;
    }

    this.form.reset({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 1,
      explanation: '',
      difficulty: 1,
    });
  }

  selectDifficulty(value: number): void {
    this.form.controls.difficulty.setValue(value);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit({
      lessonId: this.lessonId(),

      question: this.form.value.question!,

      optionA: this.form.value.optionA!,
      optionB: this.form.value.optionB!,
      optionC: this.form.value.optionC!,
      optionD: this.form.value.optionD!,

      correctAnswer: Number(this.form.value.correctAnswer),

      explanation: this.form.value.explanation!,

      difficulty: Number(this.form.value.difficulty),
    });
  }
}