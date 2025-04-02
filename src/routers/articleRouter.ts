import express from 'express';
import { withAsync } from '../lib/withAsync';
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
} from '../controllers/articleController';
import passport from '../config/passport';
import articleAuth from '../middlewares/articleAuth';
import { authenticatePartial } from '../config/passportPartial';
import { ACCESS_TOKEN_STRATEGY } from '../config/constants';

const articlesRouter = express.Router();
articlesRouter.post(
  '/:id/comments',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(createComment),
);
articlesRouter.get('/:id/comments', withAsync(getCommentList));
articlesRouter.get(
  '/:id/like',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(likeArticle),
);
articlesRouter.get(
  '/:id/dislike',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(dislikeArticle),
);

articlesRouter.get('/:id', authenticatePartial(ACCESS_TOKEN_STRATEGY), withAsync(getArticle));
articlesRouter.patch(
  '/:id',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  articleAuth.verifyAricleOwner,
  withAsync(updateArticle),
);
articlesRouter.delete(
  '/:id',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  articleAuth.verifyAricleOwner,
  withAsync(deleteArticle),
);

articlesRouter.post(
  '/',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(createArticle),
);
articlesRouter.get('/', withAsync(getArticleList));

export default articlesRouter;
