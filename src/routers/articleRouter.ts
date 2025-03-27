import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
  dislikeArticle,
  likeArticle,
} from '../controllers/articleController.js';
import passport from '../config/passport.js';
import articleAuth from '../middlewares/articleAuth.js';

const articlesRouter = express.Router();

articlesRouter.post(
  '/',
  passport.authenticate('access-token', { session: false }),
  withAsync(createArticle),
);
articlesRouter.get('/', withAsync(getArticleList));
articlesRouter.get('/:id', withAsync(getArticle));
articlesRouter.patch(
  '/:id',
  passport.authenticate('access-token', { session: false }),
  articleAuth.verifyAricleOwner,
  withAsync(updateArticle),
);
articlesRouter.delete(
  '/:id',
  passport.authenticate('access-token', { session: false }),
  articleAuth.verifyAricleOwner,
  withAsync(deleteArticle),
);
articlesRouter.post(
  '/:id/comments',
  passport.authenticate('access-token', { session: false }),
  withAsync(createComment),
);
articlesRouter.get('/:id/comments', withAsync(getCommentList));
articlesRouter.get(
  '/:id/like',
  passport.authenticate('access-token', { session: false }),
  withAsync(likeArticle),
);
articlesRouter.get(
  '/:id/dislike',
  passport.authenticate('access-token', { session: false }),
  withAsync(dislikeArticle),
);
export default articlesRouter;
