import { create } from 'superstruct';
import { UpdateCommentBodyStruct } from '../structs/commentStruct';
import { IdParamsStruct } from '../structs/commonStructs';
import commentService from '../services/commentService';
import { Request, Response } from 'express';

/**
 * @openapi
 * /comments/{id}:
 *   patch:
 *     summary: 댓글 수정
 *     description: 특정 ID를 가진 댓글의 내용을 수정합니다.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 수정할 댓글의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정할 댓글 내용
 *                 example: "This is the updated comment."
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: 댓글을 찾을 수 없습니다.
 */
export async function updateComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateCommentBodyStruct);
  const updatedComment = await commentService.update(id, data);
  res.send(updatedComment);
}

/**
 * @openapi
 * /comments/{id}:
 *   delete:
 *     summary: 댓글 삭제
 *     description: 특정 ID를 가진 댓글을 삭제합니다.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 삭제할 댓글의 ID
 *     responses:
 *       204:
 *         description: 댓글 삭제 성공
 *       404:
 *         description: 댓글을 찾을 수 없습니다.
 */
export async function deleteComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await commentService.deleteById(id);
  res.status(204).send();
}
