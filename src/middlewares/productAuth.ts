import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import productService from '../services/productService';
import { IdParamsStruct } from '../structs/commonStructs';
import { create } from 'superstruct';
import { NextFunction, Request, Response } from 'express';

async function verifyProductOwner(req: Request, res: Response, next: NextFunction) {
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);
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
