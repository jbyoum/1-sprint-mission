import { create } from 'superstruct';
import { UpdateCommentBodyStruct } from '../structs/commentStruct';
import { IdParamsStruct } from '../structs/commonStructs';
import commentService from '../services/commentService';
import { Request, Response } from 'express';

export async function updateComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateCommentBodyStruct);
  const updatedComment = await commentService.update(id, data);
  res.send(updatedComment);
}

export async function deleteComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await commentService.deleteById(id);
  res.status(204).send();
}
