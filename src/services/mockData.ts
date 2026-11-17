import type { Conversation, Message, User } from '../types/chat';
import { subHours, subMinutes, subDays } from 'date-fns';

export const CURRENT_USER_ID = 'user-me';

export const INITIAL_USERS: Record<string, User> = {
  'user-me': {
    id: 'user-me',
    name: 'Alex Rivera (You)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    role: 'Senior Frontend Engineer',
  },
  'user-1': {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    role: 'Staff Product Designer',
  },
  'user-2': {
    id: 'user-2',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    role: 'Engineering Manager',
  },
  'user-3': {
    id: 'user-3',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'away',
    role: 'Principal Architect',
  },
  'user-4': {
    id: 'user-4',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'offline',
    role: 'DevOps Lead',
  },
  'user-5': {
    id: 'user-5',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    role: 'QA Automation Lead',
  },
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    type: 'group',
    name: 'Frontend Architecture Guild',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    participantIds: ['user-me', 'user-1', 'user-2', 'user-3'],
    unreadCount: 0,
    description: 'Core frontend engineering discussions, state management patterns, performance & UI design systems.',
    pinned: true,
  },
  {
    id: 'conv-2',
    type: 'direct',
    name: 'Sarah Chen',
    avatar: INITIAL_USERS['user-1'].avatar,
    participantIds: ['user-me', 'user-1'],
    unreadCount: 2,
    pinned: true,
  },
  {
    id: 'conv-3',
    type: 'direct',
    name: 'Marcus Vance',
    avatar: INITIAL_USERS['user-2'].avatar,
    participantIds: ['user-me', 'user-2'],
    unreadCount: 0,
  },
  {
    id: 'conv-4',
    type: 'group',
    name: 'Design Systems & UI Kit v4',
    avatar: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=150&auto=format&fit=crop&q=80',
    participantIds: ['user-me', 'user-1', 'user-5'],
    unreadCount: 1,
    description: 'Collaborating on dark/light mode tokens, accessibility (WCAG AA), and Tailwind components.',
  },
  {
    id: 'conv-5',
    type: 'direct',
    name: 'Elena Rostova',
    avatar: INITIAL_USERS['user-3'].avatar,
    participantIds: ['user-me', 'user-3'],
    unreadCount: 0,
  },
];

const now = new Date();

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'm-101',
      conversationId: 'conv-1',
      senderId: 'user-2',
      content: 'Welcome to the Frontend Architecture Guild! How is the new chat client coming along?',
      timestamp: subDays(now, 1).toISOString(),
      status: 'read',
      reactions: [{ emoji: '🚀', userIds: ['user-1', 'user-me'] }],
    },
    {
      id: 'm-102',
      conversationId: 'conv-1',
      senderId: 'user-me',
      content: 'We just finished the feature-based modular structure with Zustand persistence and optimistic updates.',
      timestamp: subHours(now, 3).toISOString(),
      status: 'read',
      replyToId: 'm-101',
      reactions: [{ emoji: '🔥', userIds: ['user-2', 'user-3'] }],
    },
    {
      id: 'm-103',
      conversationId: 'conv-1',
      senderId: 'user-1',
      content: 'Love the dark and light theme transitions! Try hovering any message to reply, react, edit, or delete.',
      timestamp: subMinutes(now, 25).toISOString(),
      status: 'read',
      reactions: [{ emoji: '❤️', userIds: ['user-me'] }],
    },
  ],
  'conv-2': [
    {
      id: 'm-201',
      conversationId: 'conv-2',
      senderId: 'user-1',
      content: 'Hey Alex! Did you get a chance to review the new responsive mobile layout specs?',
      timestamp: subHours(now, 2).toISOString(),
      status: 'read',
      reactions: [],
    },
    {
      id: 'm-202',
      conversationId: 'conv-2',
      senderId: 'user-1',
      content: 'Also make sure keyboard shortcuts (Enter to send, Shift+Enter for newline) feel super snappy!',
      timestamp: subMinutes(now, 12).toISOString(),
      status: 'read',
      reactions: [],
    },
  ],
  'conv-3': [
    {
      id: 'm-301',
      conversationId: 'conv-3',
      senderId: 'user-2',
      content: 'The hiring panel really values clean separation between UI components and state logic.',
      timestamp: subDays(now, 2).toISOString(),
      status: 'read',
      reactions: [{ emoji: '👍', userIds: ['user-me'] }],
    },
  ],
  'conv-4': [
    {
      id: 'm-401',
      conversationId: 'conv-4',
      senderId: 'user-5',
      content: 'All Vitest unit and component interaction tests are green on CI!',
      timestamp: subMinutes(now, 45).toISOString(),
      status: 'read',
      reactions: [{ emoji: '🎉', userIds: ['user-1'] }],
    },
  ],
  'conv-5': [
    {
      id: 'm-501',
      conversationId: 'conv-5',
      senderId: 'user-3',
      content: 'Let me know when you want to test the offline message queue simulation.',
      timestamp: subDays(now, 1).toISOString(),
      status: 'read',
      reactions: [],
    },
  ],
};

export const AUTO_REPLIES = [
  'That looks super clean! The optimistic UI update felt instantaneous ⚡',
  'Great point! Having Zustand handle local persistence makes state hydration effortless.',
  'I just tested the dark/light mode toggle and responsive drawer—works like a charm!',
  'Can we also check how the group member management drawer handles adding/removing users?',
  'Awesome architecture! Separating features into self-contained modules scales really well.',
];