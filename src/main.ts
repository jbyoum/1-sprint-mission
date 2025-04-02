import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import passport from './middlewares/passport/passport';
import { PORT, UPLOAD_FOLDER, STATIC_PATH } from './config/constants';
import usersRouter from './routers/userRouter';
import articlesRouter from './routers/articleRouter';
import productsRouter from './routers/productRouter';
import commentsRouter from './routers/commentRouter';
import imagesRouter from './routers/imageRouter';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController';

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
