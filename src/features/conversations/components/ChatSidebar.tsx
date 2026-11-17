import React from 'react';
import {
  Search,
  MessageSquarePlus,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Sparkles,
  RotateCcw,
  X,
} from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';
import { useDebounce } from '../../../hooks/useDebounce';
import { ConversationItem } from './ConversationItem';
import type { ConversationFilter } from '../../../types/chat';
import { cn } from '../../../utils/cn';

export const ChatSidebar: React.FC = () => {
  const {
    conversations,
    messages,
    users,
    currentUserId,
    activeConversationId,
    searchQuery,
    filter,
    darkMode,
    isOffline,
    setActiveConversation,
    setSearchQuery,
    setFilter,
    toggleDarkMode,
    toggleOfflineMode,
    triggerSimulatedIncoming,
    resetDemoData,
  } = useChatStore();

  const debouncedSearch = useDebounce(searchQuery, 200);

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase().trim());
    if (!matchesSearch) return false;
    if (filter === 'unread') return conv.unreadCount > 0;
    if (filter === 'groups') return conv.type === 'group';
    return true;
  });

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const filters: { id: ConversationFilter; label: string; count?: number }[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread', count: totalUnread },
    { id: 'groups', label: 'Groups' },
  ];

  return (
    <aside className="w-full md:w-80 lg:w-96 flex flex-col h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 select-none">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/30">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                PulseChat
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Pro
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Real-Time Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleOfflineMode}
              title={isOffline ? 'Switch to Online Mode' : 'Simulate Offline Queue Mode'}
              className={cn(
                'p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1',
                isOffline
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              {isOffline ? (
                <WifiOff className="w-4 h-4" />
              ) : (
                <Wifi className="w-4 h-4 text-emerald-500" />
              )}
            </button>

            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-3 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Demo Tools:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => triggerSimulatedIncoming()}
              className="text-[11px] font-medium px-2 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
              title="Simulate a teammate typing and sending a message"
            >
              + Incoming Msg
            </button>
            <button
              onClick={resetDemoData}
              className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-3">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5',
                filter === f.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              )}
            >
              <span>{f.label}</span>
              {typeof f.count === 'number' && f.count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white">
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No conversations found
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Try clearing your search or switching filter tabs.
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const convMessages = messages[conv.id] || [];
            const lastMessage = convMessages[convMessages.length - 1];
            const otherUserId = conv.participantIds.find((id) => id !== currentUserId);
            const otherUser = otherUserId ? users[otherUserId] : undefined;

            return (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                lastMessage={lastMessage}
                otherUser={otherUser}
                isActive={conv.id === activeConversationId}
                onSelect={() => setActiveConversation(conv.id)}
              />
            );
          })
        )}
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={users[currentUserId]?.avatar}
            alt={users[currentUserId]?.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500"
          />
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {users[currentUserId]?.name}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              ● Active now
            </p>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">v1.0.0</span>
      </div>
    </aside>
  );
};