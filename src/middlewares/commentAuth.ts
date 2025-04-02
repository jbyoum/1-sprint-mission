import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import commentService from '../services/commentService';
import { IdParamsStruct } from '../structs/commonStructs';
import { create } from 'superstruct';
import { NextFunction, Request, Response } from 'express';
import { UserWithId } from '../../types/user-with-id';

async function verifyCommentOwner(req: Request, res: Response, next: NextFunction) {
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);
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
