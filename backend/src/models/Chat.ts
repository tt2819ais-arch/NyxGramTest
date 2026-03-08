import { Chat, User } from '../utils/types';
import { db } from '../database/db';
import { toPublicUser } from './User';

export async function enrichChat(chat: Chat, currentUserId: string) {
  const participantUsers = [];
  for (const pid of chat.participants) {
    const user = await db.findUserById(pid);
    if (user) {
      participantUsers.push(toPublicUser(user));
    }
  }

  const otherUser = participantUsers.find((u) => u.id !== currentUserId);

  return {
    ...chat,
    participantUsers,
    otherUser: chat.type === 'direct' ? otherUser : null,
    displayName: chat.type === 'direct' ? otherUser?.displayName || 'Unknown' : chat.name,
    displayAvatar: chat.type === 'direct' ? otherUser?.avatarUrl : chat.avatarUrl,
    isVerified: chat.type === 'direct' ? otherUser?.isVerified : false,
  };
}
