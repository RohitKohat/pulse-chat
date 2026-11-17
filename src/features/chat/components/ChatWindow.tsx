import React from 'react';
import { MessageSquareDashed } from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { GroupInfoDrawer } from '../../groups/components/GroupInfoDrawer';

export const ChatWindow: React.FC = () => {
  const { activeConversationId } = useChatStore();

  if (!activeConversationId) {
    return (
      <main className="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center mb-4">
          <MessageSquareDashed className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Select a conversation
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
          Choose an individual or group chat from the left sidebar to start messaging.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <ChatHeader />
      <MessageList />
      <MessageInput />
      <GroupInfoDrawer />
    </main>
  );
};