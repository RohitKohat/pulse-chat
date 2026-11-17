import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Attachment,
  Conversation,
  ConversationFilter,
  Message,
  Reaction,
  User,
} from '../types/chat';
import {
  AUTO_REPLIES,
  CURRENT_USER_ID,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_USERS,
} from '../services/mockData';

interface ChatState {
  currentUserId: string;
  users: Record<string, User>;
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversationId: string | null;
  searchQuery: string;
  messageSearchQuery: string;
  filter: ConversationFilter;
  replyingTo: Message | null;
  editingMessage: Message | null;
  isOffline: boolean;
  darkMode: boolean;
  isGroupDrawerOpen: boolean;
  toastMessage: string | null;

  setActiveConversation: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setMessageSearchQuery: (q: string) => void;
  setFilter: (filter: ConversationFilter) => void;
  setReplyingTo: (msg: Message | null) => void;
  setEditingMessage: (msg: Message | null) => void;
  toggleDarkMode: () => void;
  toggleOfflineMode: () => void;
  setGroupDrawerOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
  resetDemoData: () => void;

  sendMessage: (content: string, attachment?: Attachment) => void;
  receiveMessage: (conversationId: string, senderId: string, content: string) => void;
  updateMessageStatus: (conversationId: string, messageId: string, status: Message['status']) => void;
  editMessage: (conversationId: string, messageId: string, newContent: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  toggleReaction: (conversationId: string, messageId: string, emoji: string) => void;
  setTyping: (conversationId: string, isTyping: boolean, typingUser?: string) => void;
  triggerSimulatedIncoming: (conversationId?: string) => void;

  addGroupMember: (conversationId: string, userId: string) => void;
  removeGroupMember: (conversationId: string, userId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      currentUserId: CURRENT_USER_ID,
      users: INITIAL_USERS,
      conversations: INITIAL_CONVERSATIONS,
      messages: INITIAL_MESSAGES,
      activeConversationId: INITIAL_CONVERSATIONS[0].id,
      searchQuery: '',
      messageSearchQuery: '',
      filter: 'all',
      replyingTo: null,
      editingMessage: null,
      isOffline: false,
      darkMode: true,
      isGroupDrawerOpen: false,
      toastMessage: null,

      showToast: (msg) => {
        set({ toastMessage: msg });
        setTimeout(() => {
          if (get().toastMessage === msg) {
            set({ toastMessage: null });
          }
        }, 2600);
      },

      setActiveConversation: (id) =>
        set((state) => ({
          activeConversationId: id,
          replyingTo: null,
          editingMessage: null,
          messageSearchQuery: '',
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, unreadCount: 0 } : c
          ),
        })),

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setMessageSearchQuery: (messageSearchQuery) => set({ messageSearchQuery }),
      setFilter: (filter) => set({ filter }),
      setReplyingTo: (replyingTo) => set({ replyingTo, editingMessage: null }),
      setEditingMessage: (editingMessage) => set({ editingMessage, replyingTo: null }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setGroupDrawerOpen: (isGroupDrawerOpen) => set({ isGroupDrawerOpen }),

      toggleOfflineMode: () => {
        const nextOffline = !get().isOffline;
        set({ isOffline: nextOffline });

        if (!nextOffline) {
          const { messages, updateMessageStatus, showToast } = get();
          let flushedCount = 0;
          Object.entries(messages).forEach(([convId, convMsgs]) => {
            convMsgs.forEach((m) => {
              if (m.status === 'queued') {
                flushedCount++;
                updateMessageStatus(convId, m.id, 'sent');
                setTimeout(() => updateMessageStatus(convId, m.id, 'delivered'), 500);
                setTimeout(() => updateMessageStatus(convId, m.id, 'read'), 1100);
              }
            });
          });
          if (flushedCount > 0) {
            showToast(`Back online! Flushed ${flushedCount} queued message(s).`);
          } else {
            showToast('Back online! Real-time sync active.');
          }
        } else {
          get().showToast('Offline Mode enabled: New messages will queue locally.');
        }
      },

      resetDemoData: () => {
        set({
          users: INITIAL_USERS,
          conversations: INITIAL_CONVERSATIONS,
          messages: INITIAL_MESSAGES,
          activeConversationId: INITIAL_CONVERSATIONS[0].id,
          searchQuery: '',
          messageSearchQuery: '',
          filter: 'all',
          replyingTo: null,
          editingMessage: null,
          isOffline: false,
        });
        get().showToast('Demo state reset to fresh defaults!');
      },

      sendMessage: (content, attachment) => {
        const {
          activeConversationId,
          currentUserId,
          replyingTo,
          isOffline,
          updateMessageStatus,
          triggerSimulatedIncoming,
        } = get();
        if (!activeConversationId) return;

        const messageId = `msg-${Date.now()}`;
        const newMessage: Message = {
          id: messageId,
          conversationId: activeConversationId,
          senderId: currentUserId,
          content,
          timestamp: new Date().toISOString(),
          status: isOffline ? 'queued' : 'sending',
          replyToId: replyingTo?.id,
          reactions: [],
          attachment,
        };

        set((state) => ({
          replyingTo: null,
          messages: {
            ...state.messages,
            [activeConversationId]: [
              ...(state.messages[activeConversationId] || []),
              newMessage,
            ],
          },
        }));

        if (!isOffline) {
          const targetConvId = activeConversationId;
          setTimeout(() => updateMessageStatus(targetConvId, messageId, 'sent'), 300);
          setTimeout(() => updateMessageStatus(targetConvId, messageId, 'delivered'), 800);
          setTimeout(() => updateMessageStatus(targetConvId, messageId, 'read'), 1400);

          setTimeout(() => {
            triggerSimulatedIncoming(targetConvId);
          }, 1600);
        }
      },

      triggerSimulatedIncoming: (targetConvId) => {
        const {
          activeConversationId,
          conversations,
          users,
          currentUserId,
          isOffline,
          setTyping,
          receiveMessage,
        } = get();
        if (isOffline) return;

        const convId = targetConvId || activeConversationId || conversations[0]?.id;
        const conv = conversations.find((c) => c.id === convId);
        if (!conv) return;

        const otherParticipants = conv.participantIds.filter((id) => id !== currentUserId);
        const responderId =
          otherParticipants[Math.floor(Math.random() * otherParticipants.length)] || 'user-1';
        const responderName = users[responderId]?.name.split(' ')[0] || 'Teammate';

        setTyping(convId, true, responderName);

        setTimeout(() => {
          const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
          receiveMessage(convId, responderId, randomReply);
        }, 1800);
      },

      receiveMessage: (conversationId, senderId, content) => {
        const newMessage: Message = {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          conversationId,
          senderId,
          content,
          timestamp: new Date().toISOString(),
          status: 'read',
          reactions: [],
        };

        set((state) => {
          const isCurrent = state.activeConversationId === conversationId;
          return {
            messages: {
              ...state.messages,
              [conversationId]: [...(state.messages[conversationId] || []), newMessage],
            },
            conversations: state.conversations.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    unreadCount: isCurrent ? 0 : c.unreadCount + 1,
                    isTyping: false,
                    typingUser: undefined,
                  }
                : c
            ),
          };
        });
      },

      updateMessageStatus: (conversationId, messageId, status) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: (state.messages[conversationId] || []).map((m) =>
              m.id === messageId ? { ...m, status } : m
            ),
          },
        })),

      editMessage: (conversationId, messageId, newContent) => {
        set((state) => ({
          editingMessage: null,
          messages: {
            ...state.messages,
            [conversationId]: (state.messages[conversationId] || []).map((m) =>
              m.id === messageId ? { ...m, content: newContent, isEdited: true } : m
            ),
          },
        }));
        get().showToast('Message edited');
      },

      deleteMessage: (conversationId, messageId) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: (state.messages[conversationId] || []).map((m) =>
              m.id === messageId
                ? {
                    ...m,
                    content: 'This message was deleted',
                    isDeleted: true,
                    reactions: [],
                    attachment: undefined,
                  }
                : m
            ),
          },
        }));
        get().showToast('Message deleted');
      },

      toggleReaction: (conversationId, messageId, emoji) =>
        set((state) => {
          const uid = state.currentUserId;
          return {
            messages: {
              ...state.messages,
              [conversationId]: (state.messages[conversationId] || []).map((m) => {
                if (m.id !== messageId) return m;
                const existing = m.reactions.find((r) => r.emoji === emoji);
                let updatedReactions: Reaction[];
                if (existing) {
                  const hasReacted = existing.userIds.includes(uid);
                  const nextUsers = hasReacted
                    ? existing.userIds.filter((id) => id !== uid)
                    : [...existing.userIds, uid];
                  updatedReactions =
                    nextUsers.length === 0
                      ? m.reactions.filter((r) => r.emoji !== emoji)
                      : m.reactions.map((r) =>
                          r.emoji === emoji ? { ...r, userIds: nextUsers } : r
                        );
                } else {
                  updatedReactions = [...m.reactions, { emoji, userIds: [uid] }];
                }
                return { ...m, reactions: updatedReactions };
              }),
            },
          };
        }),

      setTyping: (conversationId, isTyping, typingUser) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, isTyping, typingUser } : c
          ),
        })),

      addGroupMember: (conversationId, userId) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId && !c.participantIds.includes(userId)
              ? { ...c, participantIds: [...c.participantIds, userId] }
              : c
          ),
        }));
        const userName = get().users[userId]?.name || 'Member';
        get().showToast(`${userName} added to the group`);
      },

      removeGroupMember: (conversationId, userId) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, participantIds: c.participantIds.filter((id) => id !== userId) }
              : c
          ),
        }));
        const userName = get().users[userId]?.name || 'Member';
        get().showToast(`${userName} removed from the group`);
      },
    }),
    {
      name: 'pulse-chat-production-store-v1',
    }
  )
);