import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Users,
  Info,
  X,
} from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';
import { Avatar } from '../../../components/ui/Avatar';

export const ChatHeader: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    users,
    currentUserId,
    messageSearchQuery,
    setMessageSearchQuery,
    setActiveConversation,
    setGroupDrawerOpen,
  } = useChatStore();

  const [showSearch, setShowSearch] = useState(false);

  const conversation = conversations.find((c) => c.id === activeConversationId);
  if (!conversation) return null;

  const isGroup = conversation.type === 'group';
  const otherUserId = conversation.participantIds.find((id) => id !== currentUserId);
  const otherUser = otherUserId ? users[otherUserId] : undefined;

  const onlineCount = conversation.participantIds.filter(
    (id) => users[id]?.status === 'online'
  ).length;

  return (
    <header className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur flex items-center justify-between gap-3 shrink-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          onClick={() => setActiveConversation(null)}
          className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <Avatar
          src={conversation.avatar}
          alt={conversation.name}
          status={isGroup ? undefined : otherUser?.status}
          isGroup={isGroup}
          size="md"
        />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
              {conversation.name}
            </h2>
            {isGroup && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {conversation.participantIds.length} members
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {conversation.isTyping ? (
              <span className="text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">
                {conversation.typingUser || 'Someone'} is typing...
              </span>
            ) : isGroup ? (
              `${onlineCount} online • Click info to manage members`
            ) : (
              <span className="capitalize">
                {otherUser?.status || 'offline'} • {otherUser?.role}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Right Actions: In-chat Search & Group Info Drawer */}
      <div className="flex items-center gap-2">
        {showSearch ? (
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5 border border-indigo-500/40">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <input
              type="text"
              value={messageSearchQuery}
              onChange={(e) => setMessageSearchQuery(e.target.value)}
              placeholder="Filter messages..."
              autoFocus
              className="bg-transparent text-xs focus:outline-none w-32 sm:w-48 text-slate-900 dark:text-white"
            />
            <button
              onClick={() => {
                setMessageSearchQuery('');
                setShowSearch(false);
              }}
              className="text-slate-400 hover:text-slate-600 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            title="Search in conversation"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => setGroupDrawerOpen(true)}
          title="Conversation & Group Details"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
        >
          {isGroup ? <Users className="w-4 h-4 text-indigo-500" /> : <Info className="w-4 h-4 text-indigo-500" />}
          <span className="hidden sm:inline">{isGroup ? 'Members' : 'Info'}</span>
        </button>
      </div>
    </header>
  );
};