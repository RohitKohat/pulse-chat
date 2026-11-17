import React, { useState } from 'react';
import {
  Check,
  CheckCheck,
  Clock,
  Reply,
  Edit2,
  Trash2,
  Copy,
  Smile,
  FileText,
} from 'lucide-react';
import type { Message, User } from '../../../types/chat';
import { useChatStore } from '../../../store/useChatStore';
import { formatMessageTime } from '../../../utils/dateUtils';
import { cn } from '../../../utils/cn';

const QUICK_EMOJIS = ['👍', '❤️', '🔥', '🚀', '😂', '🎉'];

interface MessageBubbleProps {
  message: Message;
  sender?: User;
  isOwn: boolean;
  repliedMessage?: Message;
  repliedSenderName?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  sender,
  isOwn,
  repliedMessage,
  repliedSenderName,
}) => {
  const {
    currentUserId,
    setReplyingTo,
    setEditingMessage,
    deleteMessage,
    toggleReaction,
    showToast,
  } = useChatStore();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    showToast('Copied message to clipboard!');
  };

  const renderStatusIcon = () => {
    if (!isOwn) return null;
    switch (message.status) {
      case 'queued':
        return (
          <span title="Queued (Offline)" className="inline-flex">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
          </span>
        );
      case 'sending':
        return (
          <span title="Sending..." className="inline-flex">
            <Clock className="w-3.5 h-3.5 text-indigo-200 animate-spin" />
          </span>
        );
      case 'sent':
        return (
          <span title="Sent" className="inline-flex">
            <Check className="w-3.5 h-3.5 text-indigo-200" />
          </span>
        );
      case 'delivered':
        return (
          <span title="Delivered" className="inline-flex">
            <CheckCheck className="w-3.5 h-3.5 text-indigo-200" />
          </span>
        );
      case 'read':
        return (
          <span title="Read" className="inline-flex">
            <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
          </span>
        );
    }
  };

  return (
    <div
      className={cn(
        'group flex items-end gap-2.5 my-1.5 relative',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {!isOwn && (
        <img
          src={sender?.avatar}
          alt={sender?.name}
          className="w-8 h-8 rounded-full object-cover shrink-0 mb-1"
        />
      )}

      <div
        className={cn(
          'max-w-[78%] sm:max-w-[65%] flex flex-col',
          isOwn ? 'items-end' : 'items-start'
        )}
      >
        {!isOwn && sender && (
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 ml-1 mb-0.5">
            {sender.name}
          </span>
        )}

        <div
          className={cn(
            'relative rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all',
            message.isDeleted
              ? 'bg-slate-200/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 italic border border-slate-300/50 dark:border-slate-700'
              : isOwn
              ? 'bg-indigo-600 text-white rounded-br-none'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-none'
          )}
        >
          {repliedMessage && !message.isDeleted && (
            <div
              className={cn(
                'mb-2 p-2 rounded-lg text-xs border-l-4 truncate',
                isOwn
                  ? 'bg-indigo-700/70 border-indigo-300 text-indigo-100'
                  : 'bg-slate-100 dark:bg-slate-900/70 border-indigo-500 text-slate-600 dark:text-slate-300'
              )}
            >
              <p className="font-bold text-[11px]">{repliedSenderName || 'Message'}</p>
              <p className="truncate opacity-90">{repliedMessage.content}</p>
            </div>
          )}

          {message.attachment && !message.isDeleted && (
            <div className="mb-2">
              {message.attachment.type === 'image' ? (
                <img
                  src={message.attachment.url}
                  alt={message.attachment.name}
                  className="rounded-xl max-h-60 object-cover border border-white/10"
                />
              ) : (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/10 dark:bg-white/10">
                  <FileText className="w-5 h-5 shrink-0" />
                  <div className="min-w-0 text-xs">
                    <p className="font-semibold truncate">{message.attachment.name}</p>
                    <p className="opacity-75">{message.attachment.size}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>

          <div
            className={cn(
              'flex items-center justify-end gap-1 mt-1 text-[10px]',
              isOwn ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
            )}
          >
            {message.isEdited && !message.isDeleted && <span>(edited)</span>}
            <span>{formatMessageTime(message.timestamp)}</span>
            {renderStatusIcon()}
          </div>
        </div>

        {message.reactions.length > 0 && !message.isDeleted && (
          <div className="flex flex-wrap gap-1 mt-1 z-10">
            {message.reactions.map((r) => {
              const hasReacted = r.userIds.includes(currentUserId);
              return (
                <button
                  key={r.emoji}
                  onClick={() => toggleReaction(message.conversationId, message.id, r.emoji)}
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition',
                    hasReacted
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/80 dark:border-indigo-700 dark:text-indigo-200'
                      : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                  )}
                >
                  <span>{r.emoji}</span>
                  <span className="font-semibold text-[11px]">{r.userIds.length}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {!message.isDeleted && (
        <div
          className={cn(
            'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-md relative'
          )}
        >
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker((v) => !v)}
              title="React with emoji"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
            >
              <Smile className="w-3.5 h-3.5" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-9 left-0 z-30 flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-1 shadow-xl">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      toggleReaction(message.conversationId, message.id, emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="hover:scale-125 transition-transform text-base px-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setReplyingTo(message)}
            title="Reply"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            title="Copy text"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {isOwn && (
            <button
              onClick={() => setEditingMessage(message)}
              title="Edit message"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => deleteMessage(message.conversationId, message.id)}
            title="Delete message"
            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};