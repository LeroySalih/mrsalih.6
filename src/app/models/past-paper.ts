
export class PastPaperQuestion {
  number: number;
  type: string;
  link: string;
  level: string;
  marks: number;
  available_marks: number;
  actual_marks?: number;
  mistake_type?: any;
}

export class PastPaperAnswer  extends PastPaperQuestion {
  actual_marks: number;
  mistake_type: any;
}

export class PastPaper {
  pastPaperId: string;
  date: string;
  paperTitle: string;
  paperLink: string;
  markSchemeLink: string;
  testLink?: {href: string, active: boolean, adminOnly: boolean};
  questions: PastPaperQuestion[];
}

export class PastPaperAnswers extends PastPaper {
  id: string;
  userId: string;
  created: number;
  answers?: PastPaperAnswer[];
}

