import { QuestionTypes } from '../enums/question-types';
import { QuestionStatus } from '../enums/question-status';
import { Attempt } from './attempt';

export interface Question {
    questionLabel: string;
    inputParams: number[];
    units: string;
    order: number;
    type: QuestionTypes;
    status: QuestionStatus;
    answers: any[];
    attempts: Attempt[];
    getLabel(): string;
    getAnswers(): any[];
    correctAnswer(): number;
    addAttempt(attempt: Attempt): void;
    displayAnswers(): any[];
    checkAnswer(answer: string): boolean;
    calculateAccuracy(): number;
}
