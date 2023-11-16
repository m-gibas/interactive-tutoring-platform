export interface Announcement {
  id: number;
  username: string;
  subject: string;
  text: string;
  price: number;
  datePosted: string;
  isTaken: boolean;
}

export enum Subjects {
  Mathematics = 'Mathematics',
  Physics = 'Physics',
  Chemistry = 'Chemistry',
  Biology = 'Biology',
  History = 'History',
  Geography = 'Geography',
  Programming = 'Programming',
  Arts = 'Arts',
  Music = 'Music',
  Polish = 'Polish',
  English = 'English',
  German = 'German',
  Other = 'Other'
}

export enum SortType {
  ASC = 'asc',
  DESC = 'desc'
}
