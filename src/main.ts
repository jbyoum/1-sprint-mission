import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';
import { PORT, UPLOAD_FOLDER, STATIC_PATH } from './config/constants.js';
import usersRouter from './routers/userRouter.js';
import articlesRouter from './routers/articleRouter.js';
import productsRouter from './routers/productRouter.js';
import commentsRouter from './routers/commentRouter.js';
import imagesRouter from './routers/imageRouter.js';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), UPLOAD_FOLDER)));

app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use('/images', imagesRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
