export interface QuestionSpec {
    order: number;
    answerLabel: string;
    units: string;
    questionLabel: string;
    type: string;
    inputParamsFn(): number[];
    displayAnswers(): any[];
}
