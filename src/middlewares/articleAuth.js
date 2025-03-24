import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import articleService from '../services/articleService.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { create } from 'superstruct';

async function verifyAricleOwner(req, res, next) {
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
