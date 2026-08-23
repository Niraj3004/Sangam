import { Conversation } from '../../models/Conversation';
import { Message } from '../../models/Message';
import { Connection } from '../../models/Connection';
import { emitMessage } from '../../socket';
import mongoose from 'mongoose';

export const startConversation = async (userId: string, recipientId: string) => {
  // Check if a 1:1 conversation already exists
  let conversation = await Conversation.findOne({
    isGroup: false,
    participants: { $all: [userId, recipientId], $size: 2 }
  }).populate('participants', 'email verifyTier role');

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, recipientId],
      isGroup: false
    });
    // Populate before returning
    conversation = await conversation.populate('participants', 'email verifyTier role');
  }

  return conversation;
};

export const getInbox = async (userId: string) => {
  const conversations = await Conversation.find({ participants: userId })
    .populate('participants', 'email verifyTier role')
    .populate({
      path: 'lastMessage',
      select: 'content senderId createdAt readBy'
    })
    .sort({ updatedAt: -1 });

  return conversations;
};

export const getMessages = async (conversationId: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'email verifyTier role'),
    Message.countDocuments({ conversationId })
  ]);

  return {
    messages: messages.reverse(), // Return chronological order
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

export const sendMessage = async (userId: string, conversationId: string, content: string) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  // Stranger gating (Message Requests)
  if (!conversation.isGroup) {
    const recipientId = conversation.participants.find(p => p.toString() !== userId);
    if (recipientId) {
      // Check if they are connected
      const isConnected = await Connection.findOne({
        status: 'accepted',
        $or: [
          { requesterId: userId, recipientId },
          { requesterId: recipientId, recipientId: userId }
        ]
      });

      // In a full implementation, if !isConnected, the UI should treat this as a "Message Request"
      // We will still save the message, but perhaps flag it. For now, the schema just saves it.
      // The Socket.IO emission checks blocks.
      const delivered = await emitMessage(conversationId, { content, senderId: userId, createdAt: new Date() }, userId, recipientId.toString());
      if (!delivered) {
        throw new Error('Cannot send message. You may be blocked.');
      }
    }
  } else {
    // For groups, emit to everyone
    // In a real app, emitMessage would handle an array of recipients.
  }

  const message = await Message.create({
    conversationId,
    senderId: userId,
    content,
    readBy: [userId] // Sender has implicitly read it
  });

  // Update conversation lastMessage and updatedAt
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
    updatedAt: new Date()
  });

  return await message.populate('senderId', 'email verifyTier role');
};

export const markAsRead = async (userId: string, conversationId: string) => {
  await Message.updateMany(
    { conversationId, readBy: { $ne: userId } },
    { $addToSet: { readBy: userId } }
  );

  return { success: true };
};
