import express from 'express';
import { withAsync } from '../lib/withAsync';
import { updateComment, deleteComment } from '../controllers/commentController';
import passport from '../middlewares/passport/passport';
import commentAuth from '../middlewares/commentAuth';
import { ACCESS_TOKEN_STRATEGY } from '../config/constants';

const commentsRouter = express.Router();

commentsRouter.patch(
  '/:id',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  commentAuth.verifyCommentOwner,
  withAsync(updateComment),
);
commentsRouter.delete(
  '/:id',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  commentAuth.verifyCommentOwner,
  withAsync(deleteComment),
);

export default commentsRouter;
