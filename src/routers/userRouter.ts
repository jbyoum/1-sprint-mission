import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createUser,
  editInfo,
  editPassword,
  getInfo,
  getOwnProducts,
  login,
  refreshToken,
} from '../controllers/userController.js';
import passport from '../config/passport.js';

const usersRouter = express.Router();

usersRouter.post('/signup', withAsync(createUser));
usersRouter.post('/login', passport.authenticate('local', { session: false }), withAsync(login));
usersRouter.post(
  '/token/refresh',
  passport.authenticate('refresh-token', { session: false }),
  withAsync(refreshToken),
);
usersRouter.get(
  '/info',
  passport.authenticate('access-token', { session: false }),
  withAsync(getInfo),
);
usersRouter.patch(
  '/info',
  passport.authenticate('access-token', { session: false }),
  withAsync(editInfo),
);
usersRouter.patch(
  '/password',
  passport.authenticate('access-token', { session: false }),
  withAsync(editPassword),
);
usersRouter.get(
  '/products',
  passport.authenticate('access-token', { session: false }),
  withAsync(getOwnProducts),
);

export default usersRouter;
