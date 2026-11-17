import React, { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';
import { MessageBubble } from './MessageBubble';
import { formatDateHeader, getDateKey } from '../../../utils/dateUtils';
import type { Message } from '../../../types/chat';

export const MessageList: React.FC = () => {
  const {
    activeConversationId,
    messages,
    users,
    currentUserId,
    messageSearchQuery,
    conversations,
  } = useChatStore();

  const bottomRef = useRef<HTMLDivElement>(null);

  const rawMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const filteredMessages = messageSearchQuery.trim()
    ? rawMessages.filter((m) =>
        m.content.toLowerCase().includes(messageSearchQuery.toLowerCase())
      )
    : rawMessages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages.length, activeConversationId, activeConversation?.isTyping]);

  if (filteredMessages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-3">
          <MessageSquare className="w-7 h-7" />
        </div>
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          {messageSearchQuery ? 'No matching messages found' : 'No messages yet'}
        </p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          {messageSearchQuery
            ? 'Try searching for a different keyword.'
            : 'Send a message below to kick off the conversation!'}
        </p>
      </div>
    );
  }

  const groupedByDate: { dateKey: string; label: string; items: Message[] }[] = [];
  filteredMessages.forEach((msg) => {
    const key = getDateKey(msg.timestamp);
    const lastGroup = groupedByDate[groupedByDate.length - 1];
    if (!lastGroup || lastGroup.dateKey !== key) {
      groupedByDate.push({
        dateKey: key,
        label: formatDateHeader(msg.timestamp),
        items: [msg],
      });
    } else {
      lastGroup.items.push(msg);
    }
  });

  const messageMap = new Map(rawMessages.map((m) => [m.id, m]));

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {groupedByDate.map((group) => (
        <div key={group.dateKey} className="space-y-2">
          <div className="flex justify-center my-3 sticky top-1 z-10">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-200/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 backdrop-blur shadow-sm">
              {group.label}
            </span>
          </div>

          {group.items.map((m) => {
            const repliedMsg = m.replyToId ? messageMap.get(m.replyToId) : undefined;
            const repliedSenderName = repliedMsg
              ? users[repliedMsg.senderId]?.name
              : undefined;

            return (
              <MessageBubble
                key={m.id}
                message={m}
                sender={users[m.senderId]}
                isOwn={m.senderId === currentUserId}
                repliedMessage={repliedMsg}
                repliedSenderName={repliedSenderName}
              />
            );
          })}
        </div>
      ))}

      {activeConversation?.isTyping && (
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pl-2 pt-1">
          <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.3s]" />
          </div>
          <span className="italic font-medium">
            {activeConversation.typingUser || 'Teammate'} is typing...
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};