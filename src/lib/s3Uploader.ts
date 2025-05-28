import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import { IAM_ACCESS_KEY, IAM_SECRET_ACCESS_KEY } from '../config/constants';

const bucketName = 'codeit-node-3';
const region = 'ap-northeast-2';
const accessKeyId = IAM_ACCESS_KEY;
const secretAccessKey = IAM_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function uploadFile(filePath: string, mimeType: string) {
  const fileStream = fs.createReadStream(filePath);
  const params = {
    Bucket: bucketName,
    Key: filePath,
    Body: fileStream,
    ContentType: mimeType,
  };

  const command = new PutObjectCommand(params);

  return await s3Client.send(command);
}
