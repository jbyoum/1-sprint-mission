import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import passport from './middlewares/passport/passport';
import { UPLOAD_FOLDER, STATIC_PATH, PORT, PROTOCOL, SERVER_URL } from './config/constants';
import usersRouter from './routers/userRouter';
import articlesRouter from './routers/articleRouter';
import productsRouter from './routers/productRouter';
import commentsRouter from './routers/commentRouter';
import imagesRouter from './routers/imageRouter';
import notificationsRouter from './routers/notificationRouter';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController';
import { renderHtmlWithUrl } from './lib/htmlRenderer';
//@ts-ignore
import { seedDatabase } from '../prisma/seed';

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
app.use('/notifications', notificationsRouter);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/seed', async (req, res) => {
  await seedDatabase();
  res.send({ message: 'Seeding completed.' });
});
app.get('/socket', (req, res) => {
  const html = renderHtmlWithUrl('socket-client-test.html');
  res.send(html);
});
app.get('/', (req, res) => {
  const html = renderHtmlWithUrl('index.html');
  res.send(html);
});

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

export default app;
