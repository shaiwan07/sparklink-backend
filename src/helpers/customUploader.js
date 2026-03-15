const cloudinary = require('./cloudinary');
const fs = require('fs');

/**
 * Uploads a file to Cloudinary and deletes old image if provided
 * @param {Object} params
 * @param {Object} params.file - Multer file object (with .path)
 * @param {string|null} params.oldUrl - Previous Cloudinary URL (optional)
 * @param {string} params.folder - Cloudinary folder (default: 'uploads')
 * @returns {Promise<string|null>} - Uploaded image URL
 */
const customUploader = async ({ file, oldUrl = null, folder = 'uploads' }) => {
  let uploadedUrl = null;
  if (file && file.path) {
    if (oldUrl) {
      const folderPattern = folder.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
      const publicIdMatch = oldUrl.match(new RegExp(`${folderPattern}/([^./]+)\\.[a-zA-Z0-9]+$`));
      if (publicIdMatch && publicIdMatch[1]) {
        try {
          await cloudinary.uploader.destroy(`${folder}/${publicIdMatch[1]}`);
        } catch (e) {
          console.log('Cloudinary delete error:', e);
        }
      }
    }
    const uploadResult = await cloudinary.uploader.upload(file.path, { folder });
    uploadedUrl = uploadResult.secure_url;
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      console.log('Error deleting local file:', e);
    }
  }
  return uploadedUrl;
};

module.exports = customUploader;
