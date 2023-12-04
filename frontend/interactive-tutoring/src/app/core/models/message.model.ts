export interface Message {
  firstUserUsername: string;
  secondUserUsername: string;
  message: string;
  room?: string;
  date?: string;
}

export interface UnreadMessage {
  id: number;
  username: string;
  message: Message;
}
