import {Question} from './question';
import {Attempt} from './attempt';
import { Injectable } from '@angular/core';
import {sprintf } from 'sprintf-js';
import {QuestionSpec } from './question-spec';
import { QuestionService } from '../services/question.service';
import { QuestionTypes } from '../enums/question-types';
import { QuestionStatus } from '../enums/question-status';

import { TimeConvertHrsMinsToMIns} from './time-convert-hrs-mins-to-mins';



export class QuestionFactory {
    // Used to create a blank Object
    static createQuestion(type: QuestionTypes): Question {
        switch (type) {
            case QuestionTypes.TimeConvertHrsMinsToMins :  return new TimeConvertHrsMinsToMins();
            default: return null;
        }
    }

    static createQuestions(type: QuestionTypes, count: number): Question[] {

        const questions: Question[] = [];
        for (let i = 0; i < count; i ++) {
            questions.push(QuestionFactory.createQuestion(type));
            questions[i].order = i;
        }

        return questions;
    }

    // Used to create an object with data from the DB
    static createQuestionFromDB (question: Question): Question {

        switch (question.type) {
            case QuestionTypes.TimeConvertHrsMinsToMins :  return new TimeConvertHrsMinsToMins(question);
            default: return null;
        }
    }

    static createQuestionsFromDB (questions: Question[]) {
        return questions.map ((question) => {
            return QuestionFactory.createQuestionFromDB(question);
        });
    }
}
