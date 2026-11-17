export type UserStatus = 'online' | 'offline' | 'away';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'queued';
export type ConversationFilter = 'all' | 'unread' | 'groups';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  role: string;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file';
  size: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
  replyToId?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  reactions: Reaction[];
  attachment?: Attachment;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string;
  participantIds: string[];
  unreadCount: number;
  isTyping?: boolean;
  typingUser?: string;
  description?: string;
  pinned?: boolean;
}