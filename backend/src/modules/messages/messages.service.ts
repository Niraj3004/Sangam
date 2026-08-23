import { Conversation } from '../../models/Conversation';
import { Message } from '../../models/Message';
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
