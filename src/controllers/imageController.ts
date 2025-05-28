import {
  FILE_NAME_ENCODING,
  FILE_NAME_TOSTRING,
  HOST_STRING,
  S3_ENDPOINT,
  UPLOAD_FOLDER,
} from '../config/constants';
import multer from 'multer';
import path from 'path';
import FileExtError from '../lib/errors/FileExtError';
import { Request, Response } from 'express';
import EmptyUploadError from '../lib/errors/EmptyUploadError';
import { uploadFile } from '../lib/s3Uploader';

const dirname = path.resolve();
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

const allowedMimeType = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/vnd.microsoft.icon',
  'image/x-icon',
];

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
    if (!allowedMimeType.includes(file.mimetype)) {
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

  const filePath = `${UPLOAD_FOLDER}/${req.file.filename}`;

  const result = await uploadFile(filePath, req.file.mimetype);
  console.log('File uploaded to S3:', result);

  const downloadPath = `${S3_ENDPOINT}/${filePath}`;
  res.json({ downloadPath });
}
