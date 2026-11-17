import React from 'react';
import { X, UserPlus, UserMinus, ShieldCheck } from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';
import { Avatar } from '../../../components/ui/Avatar';

export const GroupInfoDrawer: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    users,
    currentUserId,
    isGroupDrawerOpen,
    setGroupDrawerOpen,
    addGroupMember,
    removeGroupMember,
  } = useChatStore();

  if (!isGroupDrawerOpen || !activeConversationId) return null;

  const conversation = conversations.find((c) => c.id === activeConversationId);
  if (!conversation) return null;

  const isGroup = conversation.type === 'group';
  const currentParticipants = conversation.participantIds
    .map((id) => users[id])
    .filter(Boolean);

  const nonMembers = Object.values(users).filter(
    (u) => !conversation.participantIds.includes(u.id)
  );

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {isGroup ? 'Group Information' : 'Contact Details'}
          </h3>
          <button
            onClick={() => setGroupDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-6 text-center border-b border-slate-200 dark:border-slate-800">
          <div className="inline-block mb-3">
            <Avatar
              src={conversation.avatar}
              alt={conversation.name}
              size="lg"
              isGroup={isGroup}
            />
          </div>
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">
            {conversation.name}
          </h4>
          {conversation.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              {conversation.description}
            </p>
          )}
        </div>

        {/* Member List & Mock Add/Remove Functionality */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Members ({currentParticipants.length})
            </h5>
            <div className="space-y-2.5">
              {currentParticipants.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      status={member.status}
                      size="sm"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                        {member.name}
                        {member.id === currentUserId && (
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {member.role} • <span className="capitalize">{member.status}</span>
                      </p>
                    </div>
                  </div>

                  {isGroup && member.id !== currentUserId && (
                    <button
                      onClick={() => removeGroupMember(conversation.id, member.id)}
                      title="Remove from group"
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Available Members Section */}
          {isGroup && nonMembers.length > 0 && (
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Add to Group
              </h5>
              <div className="space-y-2">
                {nonMembers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-xl border border-dashed border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        status={user.status}
                        size="sm"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => addGroupMember(conversation.id, user.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};