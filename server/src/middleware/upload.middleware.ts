// src/middleware/upload.middleware.ts
// npm install multer @types/multer

import multer from "multer";

const ALLOWED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(
        new Error("Unsupported file type. Use PDF, PNG, JPG, or WEBP."),
      );
    }
    cb(null, true);
  },
});
