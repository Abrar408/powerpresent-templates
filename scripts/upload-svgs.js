const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

// Initialize Strapi for database access
let strapi;

// Load environment variables
require('dotenv').config();

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.AWS_BUCKET;
const SVG_FOLDER = path.join(__dirname, '..', 'svgs'); // Folder containing SVG files
const S3_BASE_FOLDER = 'template_svgs';

// Function to check if a folder exists in S3
async function checkFolderExists(folderPath) {
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: folderPath + '/',
    MaxKeys: 1,
  };

  try {
    const result = await s3.listObjectsV2(params).promise();
    return result.Contents.length > 0;
  } catch (error) {
    console.error(`Error checking folder ${folderPath}:`, error.message);
    return false;
  }
}

// Function to create a folder in S3 (by uploading a placeholder file)
async function createS3Folder(folderPath) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: folderPath + '/.keep', // Placeholder file to create folder
    Body: '',
    ContentType: 'text/plain',
  };

  try {
    await s3.upload(params).promise();
    console.log(`✅ Created folder: ${folderPath}`);
  } catch (error) {
    console.error(`❌ Error creating folder ${folderPath}:`, error.message);
  }
}

// Function to create or find a folder in Strapi media library
async function createOrFindStrapiFolder(folderPath) {
  if (!strapi) return null;

  try {
    // Check if folder already exists
    const existingFolder = await strapi.db.query('plugin::upload.folder').findOne({
      where: { path: folderPath },
    });

    if (existingFolder) {
      return existingFolder;
    }

    // Create folder if it doesn't exist
    const parts = folderPath.split('/').filter((part) => part !== '');
    let currentPath = '';
    let parentFolder = null;

    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      // Check if this part of the path exists
      const folder = await strapi.db.query('plugin::upload.folder').findOne({
        where: { path: `/${currentPath}` },
      });

      if (!folder) {
        // Get the highest pathId to ensure uniqueness
        const highestPathId = await strapi.db.query('plugin::upload.folder').findOne({
          orderBy: { pathId: 'desc' },
        });
        const nextPathId = highestPathId ? highestPathId.pathId + 1 : 1;

        // Create the folder
        const newFolder = await strapi.db.query('plugin::upload.folder').create({
          data: {
            name: part,
            path: `/${currentPath}`,
            pathId: nextPathId,
            parent: parentFolder ? parentFolder.id : null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        parentFolder = newFolder;
        console.log(`✅ Created Strapi folder: /${currentPath}`);
      } else {
        parentFolder = folder;
      }
    }

    return parentFolder;
  } catch (error) {
    console.error(`❌ Error creating Strapi folder ${folderPath}:`, error.message);
    return null;
  }
}

// Function to upload a file to S3 and register in Strapi
async function uploadFileToS3(filePath, s3Key) {
  const fileContent = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const fileStats = fs.statSync(filePath);

  const params = {
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: fileContent,
    ContentType: 'image/svg+xml',
    ACL: process.env.AWS_ACL || 'public-read',
  };

  try {
    const result = await s3.upload(params).promise();
    console.log(`✅ Uploaded to S3: ${s3Key} -> ${result.Location}`);

    // Register file in Strapi media library
    if (strapi) {
      try {
        // Get the folder path for this file
        const relativePath = path.dirname(s3Key.replace(`${S3_BASE_FOLDER}/`, ''));
        const folderPath = relativePath === '.' ? '/template_svgs' : `/template_svgs/${relativePath}`;

        // Create or find the folder in Strapi
        const strapiFolder = await createOrFindStrapiFolder(folderPath);

        const fileData = {
          name: fileName,
          alternativeText: `background image`,
          caption: ``,
          hash: path.parse(fileName).name + '_' + Date.now(),
          ext: '.svg',
          mime: 'image/svg+xml',
          size: (fileStats.size / 1024).toFixed(2), // Size in KB
          url: `${process.env.S3_BASE_URL}/${s3Key}`, // Relative URL for Strapi
          provider: 'aws-s3',
          provider_metadata: {
            public_id: s3Key,
            resource_type: 'image',
          },
          folder: strapiFolder ? strapiFolder.id : null,
          folderPath: folderPath,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Create file record in Strapi database using entity service
        const strapiFile = await strapi.db.query('plugin::upload.file').create({
          data: fileData,
        });
        console.log(`✅ Registered in Strapi: ${fileName} (ID: ${strapiFile.id}) in folder: ${folderPath}`);

        return { s3Result: result, strapiFile };
      } catch (strapiError) {
        console.error(`⚠️ S3 upload successful but Strapi registration failed for ${fileName}:`, strapiError.message);
        return { s3Result: result, strapiFile: null };
      }
    } else {
      return { s3Result: result, strapiFile: null };
    }
  } catch (error) {
    console.error(`❌ Error uploading ${s3Key}:`, error.message);
    return null;
  }
}

// Function to recursively read directories and files
function getFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else if (path.extname(file).toLowerCase() === '.svg') {
      fileList.push({
        localPath: filePath,
        relativePath: path.relative(SVG_FOLDER, filePath),
      });
    }
  });

  return fileList;
}

// Function to get unique folder paths from file list
function getUniqueFolders(fileList) {
  const folders = new Set();

  fileList.forEach((file) => {
    const dir = path.dirname(file.relativePath);
    if (dir !== '.') {
      // Add all parent directories
      const parts = dir.split(path.sep);
      for (let i = 1; i <= parts.length; i++) {
        const folderPath = parts.slice(0, i).join('/');
        folders.add(`${S3_BASE_FOLDER}/${folderPath}`);
      }
    }
  });

  // Always ensure base folder exists
  folders.add(S3_BASE_FOLDER);

  return Array.from(folders);
}

// Main upload function
async function uploadSvgsToS3() {
  console.log('🚀 Starting SVG upload to S3 and Strapi...');
  console.log(`📁 Local SVG folder: ${SVG_FOLDER}`);
  console.log(`☁️ S3 Bucket: ${BUCKET_NAME}`);
  console.log(`📂 S3 Base folder: ${S3_BASE_FOLDER}`);

  // Initialize Strapi if running in Strapi context
  try {
    if (typeof global.strapi !== 'undefined') {
      strapi = global.strapi;
      console.log('✅ Strapi context detected - files will be registered in media library');
    } else {
      // Try to bootstrap Strapi
      const { createStrapi } = require('@strapi/strapi');
      strapi = await createStrapi().load();
      console.log('✅ Strapi bootstrapped - files will be registered in media library');
    }
  } catch (error) {
    console.log('⚠️ Could not initialize Strapi - files will only be uploaded to S3');
    console.log('To register files in Strapi, run this script through Strapi: strapi script upload-svgs');
    strapi = null;
  }

  console.log('');

  // Check if local SVG folder exists
  if (!fs.existsSync(SVG_FOLDER)) {
    console.error(`❌ SVG folder does not exist: ${SVG_FOLDER}`);
    console.log('Please create the "svgs" folder in your project root and add your SVG files.');
    return;
  }

  try {
    // Get all SVG files recursively
    console.log('📋 Scanning for SVG files...');
    const svgFiles = getFilesRecursively(SVG_FOLDER);

    if (svgFiles.length === 0) {
      console.log('⚠️ No SVG files found in the svgs folder.');
      return;
    }

    console.log(`📊 Found ${svgFiles.length} SVG files`);
    console.log('');

    // Get unique folders that need to be created
    const foldersToCreate = getUniqueFolders(svgFiles);

    // Create folders in S3 if they don't exist
    console.log('📁 Creating S3 folders...');
    for (const folderPath of foldersToCreate) {
      const exists = await checkFolderExists(folderPath);
      if (!exists) {
        await createS3Folder(folderPath);
      } else {
        console.log(`✅ S3 folder already exists: ${folderPath}`);
      }
    }
    console.log('');

    // Create corresponding folders in Strapi media library
    if (strapi) {
      console.log('📂 Creating Strapi media folders...');
      for (const s3FolderPath of foldersToCreate) {
        // Convert S3 folder path to Strapi folder path
        const strapiPath = s3FolderPath.replace(S3_BASE_FOLDER, 'template_svgs');
        await createOrFindStrapiFolder(`/${strapiPath}`);
      }
      console.log('');
    }

    // Upload all SVG files
    console.log('⬆️ Uploading SVG files...');
    let uploadedCount = 0;
    let failedCount = 0;
    let strapiRegisteredCount = 0;

    for (const file of svgFiles) {
      const s3Key = `${S3_BASE_FOLDER}/${file.relativePath.replace(/\\/g, '/')}`;
      const result = await uploadFileToS3(file.localPath, s3Key);

      if (result && result.s3Result) {
        uploadedCount++;
        if (result.strapiFile) {
          strapiRegisteredCount++;
        }
      } else {
        failedCount++;
      }
    }

    console.log('');
    console.log('📊 Upload Summary:');
    console.log(`✅ Successfully uploaded to S3: ${uploadedCount} files`);
    if (strapi) {
      console.log(`✅ Registered in Strapi media: ${strapiRegisteredCount} files`);
    }
    console.log(`❌ Failed uploads: ${failedCount} files`);
    console.log(`📂 S3 Location: s3://${BUCKET_NAME}/${S3_BASE_FOLDER}/`);

    if (uploadedCount > 0) {
      console.log('');
      console.log('🌐 Files are accessible at:');
      console.log(`https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${S3_BASE_FOLDER}/`);

      if (strapi && strapiRegisteredCount > 0) {
        console.log('');
        console.log('📋 Files are now visible in Strapi Admin:');
        console.log('👉 Go to Content Manager > Media Library to view uploaded files');
      }
    }

    // Clean up Strapi if we bootstrapped it
    if (strapi && typeof global.strapi === 'undefined') {
      await strapi.destroy();
    }
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    if (strapi && typeof global.strapi === 'undefined') {
      await strapi.destroy();
    }
  }
}

// Run the upload if this script is executed directly
if (require.main === module) {
  uploadSvgsToS3()
    .then(() => {
      console.log('🎉 Upload process completed!');
    })
    .catch((error) => {
      console.error('💥 Upload process failed:', error);
      process.exit(1);
    });
}

module.exports = { uploadSvgsToS3 };
