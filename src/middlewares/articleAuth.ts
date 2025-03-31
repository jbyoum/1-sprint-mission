import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import articleService from '../services/articleService.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { create } from 'superstruct';
import { NextFunction, Response } from 'express';

async function verifyAricleOwner(req: RequestWithUser, res: Response, next: NextFunction) {
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);
  try {
    const { id: articleId } = create(req.params, IdParamsStruct);

    const article = await articleService.getById(articleId);

    if (!article) {
      throw new NotFoundError(articleService.getEntityName(), articleId);
    }

    if (article.userId !== userId) {
      throw new ForbiddenError();
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export default {
  verifyAricleOwner,
};
