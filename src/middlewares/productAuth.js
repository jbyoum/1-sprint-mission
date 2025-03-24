import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import productService from '../services/productService.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { create } from 'superstruct';

async function verifyProductOwner(req, res, next) {
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);
  try {
    const { id: productId } = create(req.params, IdParamsStruct);

    const product = await productService.getById(productId);

    if (!product) {
      throw new NotFoundError(productService.getEntityName(), productId);
    }

    if (product.userId !== userId) {
      throw new ForbiddenError();
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export default {
  verifyProductOwner,
};
