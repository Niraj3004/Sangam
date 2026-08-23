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

export const getSuggestions = async (userId: string) => {
  // Find all users I've already interacted with
  const existingConnections = await Connection.find({
    $or: [{ requesterId: userId }, { recipientId: userId }]
  });

  const excludeUserIds = existingConnections.map(c => 
    c.requesterId.toString() === userId ? c.recipientId : c.requesterId
  );
  excludeUserIds.push(new mongoose.Types.ObjectId(userId));

  // Find my profile to get my interests and study destination
  const myProfile = await Profile.findOne({ userId });

  // If no profile, just return random profiles
  if (!myProfile) {
    return await Profile.find({ userId: { $nin: excludeUserIds } }).limit(20);
  }

  // Basic Matchmaking Aggregation
  // Rank by same study destination or overlapping interests
  const suggestions = await Profile.aggregate([
    { 
      $match: { 
        userId: { $nin: excludeUserIds } 
      } 
    },
    {
      $addFields: {
        score: {
          $add: [
            { $cond: [{ $eq: ['$studyDestination', myProfile.studyDestination] }, 10, 0] },
            { $size: { $setIntersection: [{ $ifNull: ['$interests', []] }, { $ifNull: [myProfile.interests, []] }] } }
          ]
        }
      }
    },
    { $sort: { score: -1 } },
    { $limit: 20 }
  ]);

  return suggestions;
};
