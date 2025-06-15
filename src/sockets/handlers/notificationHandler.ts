import { AlertNotificationDTO } from '../../lib/dtos/NotificationDTO';
import { getIO } from '../index';
import { Notification } from '@prisma/client';

export function emitAlertToUser(userId: number, notification: Notification) {
  const io = getIO();
  io.to(`user_${userId}`).emit('notification', new AlertNotificationDTO(notification));
}
