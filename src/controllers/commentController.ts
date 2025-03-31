import { create } from 'superstruct';
import { UpdateCommentBodyStruct } from '../structs/commentStruct';
import { IdParamsStruct } from '../structs/commonStructs';
import commentService from '../services/commentService';
import { Response } from 'express';

export async function updateComment(req: RequestWithUser, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateCommentBodyStruct);
  const updatedComment = await commentService.update(id, data);
  return res.send(updatedComment);
}

export async function deleteComment(req: RequestWithUser, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await commentService.deleteById(id);
  return res.status(204).send();
}
