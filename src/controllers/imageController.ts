import { UPLOAD_FOLDER } from '../config/constants';
import multer from 'multer';
import path from 'path';
import { fileTypeFromFile } from 'file-type';
import fs from 'fs';
import FileExtError from '../lib/errors/FileExtError';
import { Request, Response } from 'express';
import EmptyUploadError from '../lib/errors/EmptyUploadError';

const __dirname = path.resolve();
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, UPLOAD_FOLDER));
  },
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
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
});

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    throw new EmptyUploadError();
  }
  const filePath = `${__dirname}/${UPLOAD_FOLDER}/${req.file.filename}`;
  const mimeType = await fileTypeFromFile(filePath);
  const ext = mimeType ? mimeType['ext'] : null;
  if (!ext || !allowedExt.includes(ext)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete file:', err);
    });
    throw new FileExtError();
  }
  const downloadPath = `${process.env.PROTOCOL}://${req.get(
    'host',
  )}/${UPLOAD_FOLDER}/${req.file.filename}`;
  return res.json({ downloadPath });
}
