import multer from "multer";

// Keep files in memory so we can stream the buffer directly to Cloudinary.
// Member 4 (campaigner document upload) also imports this middleware.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB cap
  fileFilter(_req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only images (JPEG/PNG/WEBP) and PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

export default upload;