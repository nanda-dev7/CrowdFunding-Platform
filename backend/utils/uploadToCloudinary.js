// import cloudinary from "../config/cloudinary.js";
// import streamifier from "streamifier";

// /**
//  * uploadToCloudinary
//  * Streams an in-memory Buffer (from multer memoryStorage) to Cloudinary.
//  *
//  * @param {Buffer} buffer    - File buffer from req.file.buffer
//  * @param {string} folder    - Cloudinary folder name (default: "campaigns")
//  * @returns {Promise<string>} - Resolves to the secure_url of the uploaded file
//  *
//  * Used by:
//  *   - Member 2: campaign cover images  → folder "campaigns"
//  *   - Member 2: timeline update images → folder "campaign-updates"
//  *   - Member 4: campaigner documents   → folder "campaigner-docs"
//  */
// const uploadToCloudinary = (buffer, folder = "campaigns") => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder, resource_type: "auto" },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result.secure_url);
//       }
//     );
//     streamifier.createReadStream(buffer).pipe(uploadStream);
//   });
// };

// export default uploadToCloudinary;




import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} buffer  - File buffer from multer memoryStorage
 * @param {string} folder  - Cloudinary folder name
 * @returns {Promise<string>} Secure URL of uploaded file
 */
const uploadToCloudinary = (buffer, folder = "pawrescue") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

export default uploadToCloudinary;