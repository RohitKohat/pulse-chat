import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from '../store/useChatStore';

describe('PulseChat Store & Business Logic', () => {
  beforeEach(() => {
    useChatStore.getState().resetDemoData();
  });

  it('sends a new message and appends it to the active conversation', () => {
    const store = useChatStore.getState();
    const activeId = store.activeConversationId!;
    const initialCount = store.messages[activeId].length;

    store.sendMessage('Hello Frontend Reviewers!');

    const updatedMessages = useChatStore.getState().messages[activeId];
    expect(updatedMessages.length).toBe(initialCount + 1);
    expect(updatedMessages[updatedMessages.length - 1].content).toBe(
      'Hello Frontend Reviewers!'
    );
  });

  it('edits an existing message and marks isEdited as true', () => {
    const store = useChatStore.getState();
    const activeId = store.activeConversationId!;
    const targetMsg = store.messages[activeId][0];

    store.editMessage(activeId, targetMsg.id, 'Updated architectural note');

    const edited = useChatStore
      .getState()
      .messages[activeId].find((m) => m.id === targetMsg.id);
    expect(edited?.content).toBe('Updated architectural note');
    expect(edited?.isEdited).toBe(true);
  });

  it('deletes a message and clears its content & reactions', () => {
    const store = useChatStore.getState();
    const activeId = store.activeConversationId!;
    const targetMsg = store.messages[activeId][0];

    store.deleteMessage(activeId, targetMsg.id);

    const deleted = useChatStore
      .getState()
      .messages[activeId].find((m) => m.id === targetMsg.id);
    expect(deleted?.isDeleted).toBe(true);
    expect(deleted?.content).toBe('This message was deleted');
    expect(deleted?.reactions.length).toBe(0);
  });

  it('toggles emoji reactions accurately', () => {
    const store = useChatStore.getState();
    const activeId = store.activeConversationId!;
    const targetMsg = store.messages[activeId][1];

    store.toggleReaction(activeId, targetMsg.id, '🎉');
    let updated = useChatStore
      .getState()
      .messages[activeId].find((m) => m.id === targetMsg.id);
    expect(updated?.reactions.some((r) => r.emoji === '🎉')).toBe(true);

    // Toggle off
    store.toggleReaction(activeId, targetMsg.id, '🎉');
    updated = useChatStore
      .getState()
      .messages[activeId].find((m) => m.id === targetMsg.id);
    expect(updated?.reactions.some((r) => r.emoji === '🎉')).toBe(false);
  });

  it('adds and removes group members', () => {
    const store = useChatStore.getState();
    store.addGroupMember('conv-1', 'user-4');
    let group = useChatStore.getState().conversations.find((c) => c.id === 'conv-1');
    expect(group?.participantIds).toContain('user-4');

    store.removeGroupMember('conv-1', 'user-4');
    group = useChatStore.getState().conversations.find((c) => c.id === 'conv-1');
    expect(group?.participantIds).not.toContain('user-4');
  });

  it('queues messages when Offline Mode is active', () => {
    const store = useChatStore.getState();
    store.toggleOfflineMode();
    expect(useChatStore.getState().isOffline).toBe(true);

    store.sendMessage('Offline queued test');
    const activeId = store.activeConversationId!;
    const msgs = useChatStore.getState().messages[activeId];
    expect(msgs[msgs.length - 1].status).toBe('queued');
  });
});