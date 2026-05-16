export interface Message {
  text: string;
  time: string;
  isUser: boolean;
  link?: string;
}

export interface Chat {
  id: string;
  recipientName: string;
  jobTitle: string;
  messages: Message[];
  unread: boolean;
  lastUpdated: number;
}
