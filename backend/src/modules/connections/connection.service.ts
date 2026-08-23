import { Connection } from '../../models/Connection';
import { Profile } from '../../models/Profile';
import mongoose from 'mongoose';

export const requestConnection = async (requesterId: string, recipientId: string, purpose?: string, note?: string) => {
  if (requesterId === recipientId) {
    const error: any = new Error('Cannot connect with yourself');
    error.statusCode = 400;
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
  return connection;
};

export const acceptConnection = async (recipientId: string, requesterId: string) => {
  const connection = await Connection.findOneAndUpdate(
    { requesterId, recipientId, status: 'pending' },
    { status: 'accepted' },
    { new: true }
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
    { new: true }
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
