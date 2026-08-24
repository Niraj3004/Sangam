import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { env } from './env.config';

// The SDK automatically configures itself when CLOUDINARY_URL is present in process.env,
// but we explicitly pass it here for safety.
cloudinary.config({
  cloudinary_url: env.CLOUDINARY_URL
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the folder based on the route
    let folder = 'sangam/general';
    if (req.baseUrl.includes('profile')) folder = 'sangam/avatars';
    else if (req.baseUrl.includes('projects')) folder = 'sangam/projects';
    else if (req.baseUrl.includes('organizations')) folder = 'sangam/organizations';
    else if (req.baseUrl.includes('communities')) folder = 'sangam/communities';
    else if (req.baseUrl.includes('knowledge')) folder = 'sangam/posts';

    return {
      folder,
      // Automatically format to webp for performance and reduce quality slightly
      format: 'webp',
      transformation: [{ quality: 'auto:good' }],
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    };
  },
});

// Create the multer instance with a 5MB size limit
export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});
