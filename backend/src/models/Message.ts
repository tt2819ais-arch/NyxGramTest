import { Message } from '../utils/types';
import { db } from '../database/db';
import { toPublicUser } from './User';

export async function enrichMessage(message: Message) {
  const sender = await db.findUserById(message.senderId);
  let replyTo = null;
  if (message.replyToId) {
    const replyMsg = await db.getMessages(message.chatId, 1);
    // simplified - in production would fetch by id
  }

  return {
    ...message,
    sender: sender ? toPublicUser(sender) : null,
    replyTo,
  };
}
