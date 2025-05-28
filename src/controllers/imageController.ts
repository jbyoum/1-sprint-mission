import {
  FILE_NAME_ENCODING,
  FILE_NAME_TOSTRING,
  HOST_STRING,
  UPLOAD_FOLDER,
} from '../config/constants';
import multer from 'multer';
import path from 'path';
import FileExtError from '../lib/errors/FileExtError';
import { Request, Response } from 'express';
import EmptyUploadError from '../lib/errors/EmptyUploadError';

const dirname = path.resolve();
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const allowedExt = [
  'jpg',
  'j2c',
  'jp2',
  'jpm',
  'jpx',
  'png',
  'webp',
  'avif',
  'bmp',
  'gif',
  'icns',
  'ico',
];

const mimeToExtMap: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/bmp': 'bmp',
  'image/gif': 'gif',
  'image/vnd.microsoft.icon': 'ico',
  'image/x-icon': 'ico',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(dirname, UPLOAD_FOLDER));
  },
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, FILE_NAME_ENCODING).toString(
      FILE_NAME_TOSTRING,
    );
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    const uniqueFileName = `${baseName}-${timestamp}${ext}`;
    cb(null, uniqueFileName);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fieldNameSize: 100, fileSize: FILE_SIZE_LIMIT },
  fileFilter: (req, file, cb) => {
    const extFromMime = mimeToExtMap[file.mimetype];
    if (!extFromMime || !allowedExt.includes(extFromMime)) {
      cb(new FileExtError());
    } else {
      cb(null, true);
    }
  },
});

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    throw new EmptyUploadError();
  }

  const downloadPath = `${process.env.PROTOCOL}://${req.get(
    HOST_STRING,
  )}/${UPLOAD_FOLDER}/${req.file.filename}`;
  res.json({ downloadPath });
}
