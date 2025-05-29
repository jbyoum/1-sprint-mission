import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import { Request, Response } from 'express';
import { UserWithId } from '../../types/user-with-id';
import notificationService from '../services/notificationService';
import ForbiddenError from '../lib/errors/ForbiddenError';

/**
 * @openapi
 * /notifications/{id}/read:
 *   post:
 *     summary: 알림 읽음 처리
 *     description: 특정 ID를 가진 알림을 읽음 상태로 변경합니다.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 읽음 처리할 알림의 ID
 *     responses:
 *       201:
 *         description: 알림 읽음 처리 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       403:
 *         description: 사용자가 해당 알림에 접근할 권한이 없습니다.
 *       404:
 *         description: 알림을 찾을 수 없습니다.
 */
export async function readNotification(req: Request, res: Response) {
  const reqUser = req.user as UserWithId;
  const { id: notificationId } = create(req.params, IdParamsStruct);

  const originNotification = await notificationService.getById(notificationId);
  if (originNotification?.userId !== reqUser.id) {
    throw new ForbiddenError('Notification', notificationId, reqUser.id);
  }

  const notification = await notificationService.markNotificationAsRead(notificationId);
  res.status(201).send(notification);
}
