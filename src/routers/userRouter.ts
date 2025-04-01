import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createUser,
  editInfo,
  editPassword,
  getInfo,
  getOwnProducts,
  login,
  refreshToken,
} from '../controllers/userController';
import passport from '../config/passport';
import { ACCESS_TOKEN_STRING, LOCAL_STRING, REFRESH_TOKEN_STRING } from '../config/constants';

const usersRouter = express.Router();

usersRouter.post('/signup', withAsync(createUser));
usersRouter.post(
  '/login',
  passport.authenticate(LOCAL_STRING, { session: false }),
  withAsync(login),
);
usersRouter.post(
  '/token/refresh',
  passport.authenticate(REFRESH_TOKEN_STRING, { session: false }),
  withAsync(refreshToken),
);
usersRouter.get(
  '/info',
  passport.authenticate(ACCESS_TOKEN_STRING, { session: false }),
  withAsync(getInfo),
);
usersRouter.patch(
  '/info',
  passport.authenticate(ACCESS_TOKEN_STRING, { session: false }),
  withAsync(editInfo),
);
usersRouter.patch(
  '/password',
  passport.authenticate(ACCESS_TOKEN_STRING, { session: false }),
  withAsync(editPassword),
);
usersRouter.get(
  '/products',
  passport.authenticate(ACCESS_TOKEN_STRING, { session: false }),
  withAsync(getOwnProducts),
);

export default usersRouter;
