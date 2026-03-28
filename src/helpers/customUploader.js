const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

/**
 * Create S3Client for DigitalOcean Spaces
 */
const s3 = new S3Client({
  endpoint: process.env.DO_SPACE_ENDPOINT,
  region: process.env.DO_SPACE_REGION,
  credentials: {
    accessKeyId: process.env.DO_SPACE_KEY,
    secretAccessKey: process.env.DO_SPACE_SECRET,
  },
});

/**
 * Uploads a file to DigitalOcean Spaces 
 * @param {Object} params
 * @param {Object} params.file - Multer file object (with .buffer)
 * @param {string} params.folder - Folder in Spaces (default: 'uploads')
 * @returns {Promise<string|null>} - Uploaded image URL
 */
const customUploader = async ({ file, folder = 'uploads' }) => {
  if (!file || !file.buffer) return null;

  const fileExt = file.originalname.split('.').pop();
  const fileName = `${folder}/${uuidv4()}.${fileExt}`;

  const command = new PutObjectCommand({
    Bucket: process.env.DO_SPACE_NAME,
    Key: fileName,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype,
  });

  try {
    await s3.send(command);
    return `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_NAME}/${fileName}`;
  } catch (err) {
    console.error('DigitalOcean upload error:', err);
    return null;
  }
};

module.exports = customUploader;