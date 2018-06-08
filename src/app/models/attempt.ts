import { QuestionStatus} from '../enums/question-status';

export interface Attempt {
    status: QuestionStatus;
    answer: number;
}
