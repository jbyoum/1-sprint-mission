import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { updateComment, deleteComment } from '../controllers/commentController.js';
import passport from '../config/passport.js';
import commentAuth from '../middlewares/commentAuth.js';

const commentsRouter = express.Router();

commentsRouter.patch(
  '/:id',
  passport.authenticate('access-token', { session: false }),
  commentAuth.verifyCommentOwner,
  withAsync(updateComment),
);
commentsRouter.delete(
  '/:id',
  passport.authenticate('access-token', { session: false }),
  commentAuth.verifyCommentOwner,
  withAsync(deleteComment),
);

export default commentsRouter;
