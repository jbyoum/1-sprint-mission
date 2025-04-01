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
} from '../controllers/productController';
import passport from '../config/passport';
import productAuth from '../middlewares/productAuth';
import { ACCESS_TOKEN_STRING } from '../config/constants';
import { authenticatePartial } from '../config/passportPartial';

const productsRouter = express.Router();

productsRouter.post(
  '/',
  passport.authenticate(ACCESS_TOKEN_STRING, { session: false }),
  withAsync(createProduct),
);
productsRouter.get('/:id', authenticatePartial(ACCESS_TOKEN_STRING), withAsync(getProduct));
productsRouter.patch(
  '/:id',
  passport.authenticate(ACCESS_TOKEN_STRING, { session: false }),
  productAuth.verifyProductOwner,
  withAsync(updateProduct),
);
productsRouter.delete(
  '/:id',
  passport.authenticate(ACCESS_TOKEN_STRING, { session: false }),
  productAuth.verifyProductOwner,
  withAsync(deleteProduct),
);
productsRouter.get('/', withAsync(getProductList));
productsRouter.post(
  '/:id/comments',
  passport.authenticate(ACCESS_TOKEN_STRING, { session: false }),
  withAsync(createComment),
);
productsRouter.get('/:id/comments', withAsync(getCommentList));
productsRouter.get(
  '/:id/like',
  passport.authenticate(ACCESS_TOKEN_STRING, { session: false }),
  withAsync(likeProduct),
);
productsRouter.get(
  '/:id/dislike',
  passport.authenticate(ACCESS_TOKEN_STRING, { session: false }),
  withAsync(dislikeProduct),
);

export default productsRouter;
