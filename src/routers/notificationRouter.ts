import express from 'express';
import { withAsync } from '../lib/withAsync';
import passport from '../middlewares/passport/passport';
import { ACCESS_TOKEN_STRATEGY } from '../config/constants';
import { readNotification } from '../controllers/notificationController';

const notificationsRouter = express.Router();

notificationsRouter.patch(
  '/:id/read',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(readNotification),
);

export default notificationsRouter;
