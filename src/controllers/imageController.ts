import {
  FILE_NAME_ENCODING,
  FILE_NAME_TOSTRING,
  S3_ENDPOINT,
  UPLOAD_FOLDER,
} from '../config/constants';
import multer from 'multer';
import path from 'path';
import FileExtError from '../lib/errors/FileExtError';
import { Request, Response } from 'express';
import EmptyUploadError from '../lib/errors/EmptyUploadError';
import { uploadFile } from '../lib/s3Uploader';
import fs from 'fs';

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

/**
 * @openapi
 * /images/upload:
 *   post:
 *     summary: 이미지 업로드
 *     description: 사용자가 이미지를 업로드합니다. 지원되는 파일 형식은 JPEG, PNG, WEBP, AVIF, BMP, GIF, ICO입니다.
 *     tags:
 *       - Images
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 이미지 파일
 *     responses:
 *       200:
 *         description: 이미지 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileName:
 *                   type: string
 *                   description: 업로드된 파일 이름
 *                   example: "image-1661234567890.png"
 *                 filePath:
 *                   type: string
 *                   description: 업로드된 파일 경로
 *                   example: "/uploads/image-1661234567890.png"
 *       400:
 *         description: 잘못된 파일 형식 또는 파일 크기 초과
 *       500:
 *         description: 서버 오류. 업로드 과정에서 문제가 발생했습니다.
 */
export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    throw new EmptyUploadError();
  }

  const filePath = `${UPLOAD_FOLDER}/${req.file.filename}`;

  const result = await uploadFile(filePath, req.file.mimetype);
  console.log('File uploaded to S3:', result);

  const downloadPath = `${S3_ENDPOINT}/${filePath}`;
  try {
    fs.unlinkSync(path.join(dirname, filePath));
  } catch (err) {
    console.error('파일 삭제 중 오류 발생:', err);
  }
  res.json({ downloadPath });
}
