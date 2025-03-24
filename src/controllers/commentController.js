import { create } from 'superstruct';
import { UpdateCommentBodyStruct } from '../structs/commentStruct.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import commentService from '../services/commentService.js';

export async function updateComment(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateCommentBodyStruct);
  const updatedComment = await commentService.update(id, data);
  return res.send(updatedComment);
}

export async function deleteComment(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  await commentService.delete(id);
  return res.status(204).send();
}
