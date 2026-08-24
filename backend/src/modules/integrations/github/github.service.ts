import { Profile } from '../../../models/Profile';
import { User } from '../../../models/User';
import https from 'https';

// Helper to fetch from GitHub API
const fetchFromGithub = (url: string, token?: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      headers: {
        'User-Agent': 'Sangam-App',
        ...(token ? { Authorization: `token ${token}` } : {})
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode} ${data}`));
        }
      });
    }).on('error', reject);
  });
};

export const connectGithub = async (userId: string, username: string, token?: string) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) throw new Error('Profile not found');

  // Verify the username exists
  const githubUser = await fetchFromGithub(`https://api.github.com/users/${username}`, token);
  
  if (!profile.links) profile.links = {};
  profile.links.github = githubUser.html_url;
  await profile.save();

  // We could securely store the PAT in the User model if needed, but for MVP we just link the username.
  return { success: true, githubUrl: profile.links.github };
};

export const getPublicRepos = async (userId: string) => {
  const profile = await Profile.findOne({ userId });
  if (!profile || !profile.links?.github) throw new Error('GitHub not connected');

  const username = profile.links.github.split('/').pop();
  const repos = await fetchFromGithub(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
  
  return repos.map((r: any) => ({
    name: r.name,
    description: r.description,
    url: r.html_url,
    language: r.language,
    stars: r.stargazers_count,
  }));
};

export const importRepository = async (userId: string, repoData: any) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) throw new Error('Profile not found');

  // Check if already imported
  const exists = profile.githubRepositories.find(r => r.url === repoData.url);
  if (!exists) {
    profile.githubRepositories.push(repoData);
    await profile.save();
  }

  return profile.githubRepositories;
};
