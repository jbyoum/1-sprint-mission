import express from 'express';
import { withAsync } from '../lib/withAsync';
import { upload, uploadImage } from '../controllers/imageController';

const imagesRouter = express.Router();

imagesRouter.post('/upload', upload.single('image'), withAsync(uploadImage));

export default imagesRouter;
