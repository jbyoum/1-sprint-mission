import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
  dislikeProduct,
  likeProduct,
  getOwnProducts,
  getLikedProducts,
} from '../controllers/productController';
import passport from '../middlewares/passport/passport';
import productAuth from '../middlewares/productAuth';
import { ACCESS_TOKEN_STRATEGY } from '../config/constants';
import { authenticatePartial } from '../middlewares/passport/passportPartial';

const productsRouter = express.Router();
productsRouter.get(
  '/me',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(getOwnProducts),
);
productsRouter.get(
  '/like',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(getLikedProducts),
);

productsRouter.post(
  '/:id/comments',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(createComment),
);
productsRouter.get('/:id/comments', withAsync(getCommentList));
productsRouter.get(
  '/:id/like',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(likeProduct),
);
productsRouter.get(
  '/:id/dislike',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(dislikeProduct),
);

productsRouter.get('/:id', authenticatePartial(ACCESS_TOKEN_STRATEGY), withAsync(getProduct));
productsRouter.patch(
  '/:id',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  productAuth.verifyProductOwner,
  withAsync(updateProduct),
);
productsRouter.delete(
  '/:id',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  productAuth.verifyProductOwner,
  withAsync(deleteProduct),
);

productsRouter.post(
  '/',
  passport.authenticate(ACCESS_TOKEN_STRATEGY, { session: false }),
  withAsync(createProduct),
);
productsRouter.get('/', withAsync(getProductList));

export default productsRouter;
