import { Profile } from '../../models/Profile';
import { Connection } from '../../models/Connection';
import mongoose from 'mongoose';

export const getMatchSuggestions = async (userId: string) => {
  // Find all users I've already interacted with
  const existingConnections = await Connection.find({
    $or: [{ requesterId: userId }, { recipientId: userId }]
  });

  const excludeUserIds = existingConnections.map(c => 
    c.requesterId.toString() === userId ? c.recipientId.toString() : c.requesterId.toString()
  );
  excludeUserIds.push(userId);

  // Find my profile to get my interests, skills, and study destination
  const myProfile = await Profile.findOne({ userId });

  // Load up to 100 potential profiles to score in memory
  const potentialProfiles = await Profile.find({ userId: { $nin: excludeUserIds } })
    .limit(100)
    .populate('userId', 'email verifyTier role')
    .lean(); // Lean for faster processing

  if (!myProfile || potentialProfiles.length === 0) {
    return potentialProfiles.slice(0, 20).map(p => ({ ...p, matchScore: 0, reasons: [] }));
  }

  // Pre-calculate my sets for faster intersection
  const myInterests = new Set((myProfile.interests || []).map(i => i.toLowerCase()));
  const mySkills = new Set((myProfile.skills || []).map(s => s.name.toLowerCase()));
  const myLookingFor = new Set((myProfile.lookingFor || []).map(l => l.toLowerCase()));

  const scoredProfiles = potentialProfiles.map(profile => {
    let score = 0;
    const reasons: string[] = [];

    // Study Destination Match
    if (myProfile.studyDestination && profile.studyDestination && 
        myProfile.studyDestination.toLowerCase() === profile.studyDestination.toLowerCase()) {
      score += 15;
      reasons.push(`Both targeting ${profile.studyDestination} for studies`);
    }

    // Shared Interests
    const theirInterests = (profile.interests || []).map(i => i.toLowerCase());
    const sharedInterests = theirInterests.filter(i => myInterests.has(i));
    if (sharedInterests.length > 0) {
      score += sharedInterests.length * 5;
      reasons.push(`Shared interests: ${sharedInterests.slice(0, 3).join(', ')}`);
    }

    // Skill Complement (e.g. I'm looking for 'teammates' or 'co-founder' and they have a complementary skill)
    // For a real advanced engine, we would check if they have a skill we lack.
    // For now, let's just do Shared Skills:
    const theirSkills = (profile.skills || []).map(s => s.name.toLowerCase());
    const sharedSkills = theirSkills.filter(s => mySkills.has(s));
    if (sharedSkills.length > 0) {
      score += sharedSkills.length * 8;
      reasons.push(`Shared skills: ${sharedSkills.slice(0, 3).join(', ')}`);
    }

    // Looking For Synergy
    const theirLookingFor = (profile.lookingFor || []).map(l => l.toLowerCase());
    const sharedLookingFor = theirLookingFor.filter(l => myLookingFor.has(l));
    if (sharedLookingFor.length > 0) {
      score += sharedLookingFor.length * 10;
      reasons.push(`Both looking for: ${sharedLookingFor.join(', ')}`);
    }

    return {
      ...profile,
      matchScore: score,
      reasons
    };
  });

  // Sort descending by score and return top 20
  scoredProfiles.sort((a, b) => b.matchScore - a.matchScore);
  
  return scoredProfiles.slice(0, 20);
};
