import { Profile } from '../../models/Profile';
import { Connection } from '../../models/Connection';
import mongoose from 'mongoose';

import { Idea } from '../../models/Idea';
import { Project } from '../../models/Project';

export const getPeopleMatches = async (userId: string) => {
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

export const getProjectMatches = async (userId: string) => {
  const myProfile = await Profile.findOne({ userId });
  if (!myProfile) return [];

  const mySkills = new Set((myProfile.skills || []).map(s => s.name.toLowerCase()));
  
  const projects = await Project.find({ status: 'active' }).populate('ownerId', 'email').lean();
  
  const scoredProjects = projects.map(project => {
    let score = 0;
    const reasons: string[] = [];

    const projectLookingFor = new Set((project.lookingFor || []).map(l => l.toLowerCase()));
    
    // Check if user has skills the project is looking for
    const matchedSkills = (project.technologies || []).filter(t => mySkills.has(t.toLowerCase()));
    if (matchedSkills.length > 0) {
      score += matchedSkills.length * 10;
      reasons.push(`Complementary skills: You know ${matchedSkills.join(', ')}`);
    }

    if (project.remote && myProfile.availability === 'remote') {
      score += 5;
      reasons.push('Matches remote preference');
    }

    return { ...project, matchScore: score, reasons };
  });

  scoredProjects.sort((a, b) => b.matchScore - a.matchScore);
  return scoredProjects.slice(0, 20);
};

export const getIdeaMatches = async (userId: string) => {
  const myProfile = await Profile.findOne({ userId });
  if (!myProfile) return [];

  const mySkills = new Set((myProfile.skills || []).map(s => s.name.toLowerCase()));
  const myInterests = new Set((myProfile.interests || []).map(i => i.toLowerCase()));

  const ideas = await Idea.find({ collaborationStatus: 'open' }).populate('authorId', 'email').lean();

  const scoredIdeas = ideas.map(idea => {
    let score = 0;
    const reasons: string[] = [];

    const matchedSkills = (idea.skillsRequired || []).filter(s => mySkills.has(s.toLowerCase()));
    if (matchedSkills.length > 0) {
      score += matchedSkills.length * 10;
      reasons.push(`You have required skills: ${matchedSkills.join(', ')}`);
    }

    const matchedInterests = (idea.tags || []).filter(t => myInterests.has(t.toLowerCase()));
    if (matchedInterests.length > 0) {
      score += matchedInterests.length * 5;
      reasons.push(`Matches your interests: ${matchedInterests.join(', ')}`);
    }

    return { ...idea, matchScore: score, reasons };
  });

  scoredIdeas.sort((a, b) => b.matchScore - a.matchScore);
  return scoredIdeas.slice(0, 20);
};
