import { User } from './user.model';

export interface Announcement {
  //   user: User;
  username: string;
  subject: string;
  text: string;
  price: number;
  datePosted?: string;
}
