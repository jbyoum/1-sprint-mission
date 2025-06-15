import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createUser,
  editInfo,
  editPassword,
  getInfo,
  getNotifications,
  login,
  refreshToken,
} from '../controllers/userController';
import passport from '../middlewares/passport/passport';
import { ACCESS_TOKEN_STRATEGY, LOCAL_STRING, REFRESH_TOKEN_STRATEGY } from '../config/constants';

const usersRouter = express.Router();

usersRouter.post('/signup', withAsync(createUser));
usersRouter.post(
  '/login',
  passport.authenticate(LOCAL_STRING, { session: false }),
  withAsync(login),
);
usersRouter.post(
  '/token/refresh',
  passport.authenticate(REFRESH_TOKEN_STRATEGY, { session: false }),
  withAsync(refreshToken),
);
usersRouter.get(
  '/info',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(getInfo),
);
usersRouter.patch(
  '/info',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(editInfo),
);
usersRouter.patch(
  '/password',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(editPassword),
);
usersRouter.get(
  '/notifications',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(getNotifications),
);

export default usersRouter;
