import multer from "multer";
import path from "path";
import type { Request } from "express";

export interface UploadRequest extends Request {
  filename: string;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./data/files");
  },
  filename: function (req, file, cb) {
    let filename = 'anim-' + Date.now() + path.extname(file.originalname);
    cb(null, filename);
    (req as UploadRequest).filename = filename;
  },
});

const upload = multer({
  storage: storage
});

export default upload;