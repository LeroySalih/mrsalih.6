export interface SectionNotes {
    lessonId: string;
    sectionId: string;
    userId: string;
    notes: VideoNote[]; // user can have one or more addresses
  }

  export interface VideoNote {
    time: string;  // required field
    comment: string;
  }
