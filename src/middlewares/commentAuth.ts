import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import commentService from '../services/commentService.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { create } from 'superstruct';

async function verifyCommentOwner(req, res, next) {
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);
  try {
    const { id: commentId } = create(req.params, IdParamsStruct);

    const comment = await commentService.getById(commentId);

    if (!comment) {
      throw new NotFoundError(commentService.getEntityName(), commentId);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenError();
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export default {
  verifyCommentOwner,
};
