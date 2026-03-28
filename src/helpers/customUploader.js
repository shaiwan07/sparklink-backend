const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACE_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACE_KEY,
  secretAccessKey: process.env.DO_SPACE_SECRET,
  region: process.env.DO_SPACE_REGION,
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
  const params = {
    Bucket: process.env.DO_SPACE_NAME,
    Key: fileName,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype,
  };
  try {
    await s3.putObject(params).promise();
    return `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_NAME}/${fileName}`;
  } catch (err) {
    console.error('DigitalOcean upload error:', err);
    return null;
  }
};

module.exports = customUploader;
