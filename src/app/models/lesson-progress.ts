export interface LessonProgress {
    classId: string;
    userId: string;
    lessonId: string;
    sectionId: string;
    completed: boolean;
}

export interface LessonProgressId extends LessonProgress {
    id: string;
}
