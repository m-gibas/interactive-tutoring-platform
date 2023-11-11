import { User } from './user.model';

export interface Announcement {
  //   user: User;
  username: string;
  subject: string;
  text: string;
  price: number;
  datePosted: string;
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
