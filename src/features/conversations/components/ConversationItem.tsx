import React from 'react';
import { Users, Pin } from 'lucide-react';
import type { Conversation, Message, User } from '../../../types/chat';
import { Avatar } from '../../../components/ui/Avatar';
import { formatSidebarTime } from '../../../utils/dateUtils';
import { cn } from '../../../utils/cn';

interface ConversationItemProps {
  conversation: Conversation;
  lastMessage?: Message;
  otherUser?: User;
  isActive: boolean;
  onSelect: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  lastMessage,
  otherUser,
  isActive,
  onSelect,
}) => {
  const isGroup = conversation.type === 'group';
  const status = isGroup ? undefined : otherUser?.status;

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all duration-150 group relative',
        isActive
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
          : 'hover:bg-slate-200/70 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200'
      )}
    >
      <Avatar
        src={conversation.avatar}
        alt={conversation.name}
        status={status}
        isGroup={isGroup}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5 truncate">
            {isGroup && (
              <Users
                className={cn(
                  'w-3.5 h-3.5 shrink-0',
                  isActive ? 'text-indigo-200' : 'text-indigo-500 dark:text-indigo-400'
                )}
              />
            )}
            <span className="font-semibold text-sm truncate">{conversation.name}</span>
            {conversation.pinned && (
              <Pin
                className={cn(
                  'w-3 h-3 shrink-0 rotate-45',
                  isActive ? 'text-indigo-200' : 'text-slate-400'
                )}
              />
            )}
          </div>
          {lastMessage && (
            <span
              className={cn(
                'text-[11px] shrink-0 font-medium',
                isActive ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'
              )}
            >
              {formatSidebarTime(lastMessage.timestamp)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'text-xs truncate',
              isActive
                ? 'text-indigo-100'
                : conversation.unreadCount > 0
                ? 'font-semibold text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400'
            )}
          >
            {conversation.isTyping ? (
              <span
                className={cn(
                  'italic font-medium animate-pulse',
                  isActive ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'
                )}
              >
                {conversation.typingUser || 'Someone'} is typing...
              </span>
            ) : lastMessage ? (
              lastMessage.isDeleted ? (
                <span className="italic opacity-75">This message was deleted</span>
              ) : (
                lastMessage.content
              )
            ) : (
              'No messages yet'
            )}
          </p>

          {conversation.unreadCount > 0 && (
            <span
              className={cn(
                'px-1.5 py-0.5 text-[11px] font-bold rounded-full min-w-[20px] text-center shrink-0',
                isActive ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'
              )}
            >
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};