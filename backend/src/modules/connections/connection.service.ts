import { Connection } from '../../models/Connection';
import { Profile } from '../../models/Profile';
import { Block } from '../../models/Block';
import { User } from '../../models/User';
import { sendEmail } from '../../config/mailer';
import { env } from '../../config/env.config';

export const requestConnection = async (requesterId: string, recipientId: string, purpose?: string, note?: string) => {
  if (requesterId === recipientId) {
    const error: any = new Error('Cannot connect with yourself');
    error.statusCode = 400;
    throw error;
  }

  // Honour Blocks
  const isBlocked = await Block.findOne({
    $or: [
      { blockerId: recipientId, blockedId: requesterId },
      { blockerId: requesterId, blockedId: recipientId }
    ]
  });

  if (isBlocked) {
    const error: any = new Error('Cannot send connection request to this user.');
    error.statusCode = 403;
    throw error;
  }

  // Check if a connection already exists in either direction
  const existing = await Connection.findOne({
    $or: [
      { requesterId, recipientId },
      { requesterId: recipientId, recipientId: requesterId },
    ]
  });

  if (existing) {
    const error: any = new Error(`Connection is already ${existing.status}`);
    error.statusCode = 400;
    throw error;
  }

  const connection = await Connection.create({ requesterId, recipientId, status: 'pending', purpose, note });

  const recipient = await User.findById(recipientId);
  const requesterProfile = await Profile.findOne({ userId: requesterId });
  const requesterName = requesterProfile?.handle || 'A student';

  if (recipient) {
    sendEmail(
      recipient.email,
      `New Connection Request from ${requesterName}`,
      'New Connection Request',
      `<p><strong>${requesterName}</strong> wants to connect with you on Sangam.</p>
       <p><strong>Purpose:</strong> ${purpose || 'Networking'}</p>
       ${note ? `<p><strong>Note:</strong> "${note}"</p>` : ''}
       <p>Log in to view their profile and respond to the request.</p>`,
      `${env.CLIENT_URL}/network`,
      'View Request'
    ).catch(console.error);
  }

  return connection;
};

export const acceptConnection = async (recipientId: string, requesterId: string) => {
  const connection = await Connection.findOneAndUpdate(
    { requesterId, recipientId, status: 'pending' },
    { status: 'accepted' },
    { returnDocument: 'after' }
  );

  if (!connection) {
    const error: any = new Error('Pending request not found');
    error.statusCode = 404;
    throw error;
  }

  return connection;
};

export const rejectConnection = async (recipientId: string, requesterId: string) => {
  const connection = await Connection.findOneAndUpdate(
    { requesterId, recipientId, status: 'pending' },
    { status: 'rejected' },
    { returnDocument: 'after' }
  );

  if (!connection) {
    const error: any = new Error('Pending request not found');
    error.statusCode = 404;
    throw error;
  }

  return connection;
};

export const getMyConnections = async (userId: string) => {
  const connections = await Connection.find({
    $or: [{ requesterId: userId }, { recipientId: userId }],
    status: 'accepted'
  }).populate('requesterId recipientId', 'email verifyTier role');
  
  return connections;
};

export const getPendingRequests = async (userId: string) => {
  const connections = await Connection.find({
    recipientId: userId,
    status: 'pending'
  }).populate('requesterId', 'email verifyTier role');
  
  return connections;
};

