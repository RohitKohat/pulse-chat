import React, { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  Send,
  Paperclip,
  X,
  Reply,
  Edit2,
  Image as ImageIcon,
} from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';
import type { Attachment } from '../../../types/chat';

interface FormValues {
  messageText: string;
}

export const MessageInput: React.FC = () => {
  const {
    activeConversationId,
    replyingTo,
    editingMessage,
    users,
    sendMessage,
    editMessage,
    setReplyingTo,
    setEditingMessage,
  } = useChatStore();

  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, control } = useForm<FormValues>({
    defaultValues: { messageText: '' },
  });

  const messageValue = useWatch({
    control,
    name: 'messageText',
    defaultValue: '',
  });

  useEffect(() => {
    if (editingMessage) {
      setValue('messageText', editingMessage.content);
    } else {
      setValue('messageText', '');
    }
  }, [editingMessage, setValue]);

  const onSubmit = (data: FormValues) => {
    const trimmed = data.messageText.trim();
    if (!trimmed && !attachment) return;
    if (!activeConversationId) return;

    if (editingMessage) {
      editMessage(activeConversationId, editingMessage.id, trimmed);
    } else {
      sendMessage(
        trimmed || (attachment ? `Shared ${attachment.name}` : ''),
        attachment || undefined
      );
    }

    setAttachment(null);
    reset({ messageText: '' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const url = URL.createObjectURL(file);
    setAttachment({
      id: `att-${Date.now()}`,
      name: file.name,
      url,
      type: isImage ? 'image' : 'file',
      size: `${(file.size / 1024).toFixed(1)} KB`,
    });
    e.target.value = '';
  };

  return (
    <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      {(replyingTo || editingMessage) && (
        <div className="mb-2 px-3 py-2 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            {editingMessage ? (
              <Edit2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            ) : (
              <Reply className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            )}
            <div className="truncate">
              <span className="font-bold text-indigo-700 dark:text-indigo-300">
                {editingMessage
                  ? 'Editing message'
                  : `Replying to ${users[replyingTo!.senderId]?.name || 'message'}`}
              </span>
              <p className="text-slate-600 dark:text-slate-400 truncate">
                {editingMessage ? editingMessage.content : replyingTo?.content}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setReplyingTo(null);
              setEditingMessage(null);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {attachment && (
        <div className="mb-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {attachment.type === 'image' ? (
              <img
                src={attachment.url}
                alt={attachment.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-indigo-500" />
            )}
            <div className="text-xs truncate">
              <p className="font-semibold truncate text-slate-800 dark:text-slate-200">
                {attachment.name}
              </p>
              <p className="text-slate-400">{attachment.size}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="p-1 text-slate-400 hover:text-rose-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach image or file"
          className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <textarea
          {...register('messageText')}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Write a message... (Enter to send, Shift+Enter for new line)"
          className="flex-1 max-h-32 resize-none rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
        />

        <button
          type="submit"
          disabled={!messageValue?.trim() && !attachment}
          aria-label="Send message"
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white shadow-md shadow-indigo-600/20 transition shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};