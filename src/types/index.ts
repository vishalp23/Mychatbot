export interface User {
  uid: string;
  email: string | null;
  displayName?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface Message {
  id: string;
  text: string;
  createdAt: number;
  userId: string;
  isAI: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
  lastMessage?: string;
  messages: Message[];
}
