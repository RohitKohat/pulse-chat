import { useEffect } from 'react';
import { useChatStore } from './store/useChatStore';
import { ChatSidebar } from './features/conversations/components/ChatSidebar';
import { ChatWindow } from './features/chat/components/ChatWindow';
import { cn } from './utils/cn';

export function App() {
  const { darkMode, activeConversationId, toastMessage, isOffline } = useChatStore();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-100 dark:bg-slate-950">
      {isOffline && (
        <div className="bg-amber-500 text-slate-950 text-xs font-bold py-1 px-4 text-center shadow-sm">
          ⚡ Offline Queue Mode Active — Messages you send now are queued and will auto-send when you switch back online.
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        <div
          className={cn(
            'w-full md:w-auto h-full flex',
            activeConversationId ? 'hidden md:flex' : 'flex'
          )}
        >
          <ChatSidebar />
        </div>

        <div
          className={cn(
            'flex-1 h-full flex',
            !activeConversationId ? 'hidden md:flex' : 'flex'
          )}
        >
          <ChatWindow />
        </div>

        {toastMessage && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xl animate-bounce">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;