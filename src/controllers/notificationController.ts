import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import { Request, Response } from 'express';
import { UserWithId } from '../../types/user-with-id';
import notificationService from '../services/notificationService';
import ForbiddenError from '../lib/errors/ForbiddenError';

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
