import notificationRepository from '../repositories/notificationRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import { CreateNotificationDTO } from '../lib/dtos/NotificationDTO';
import { NotificationType } from '@prisma/client';

async function getById(id: number) {
  return await notificationRepository.getById(id);
}

async function createNotification(userId: number, content: string, type: NotificationType) {
  return await notificationRepository.create(new CreateNotificationDTO(userId, content, type));
}

async function getUserNotifications(userId: number, onlyUnread = false) {
  return await notificationRepository.getList(userId, onlyUnread);
}

async function markNotificationAsRead(id: number) {
  const updated = await notificationRepository.setReadTrue(id);
  if (!updated) {
    throw new NotFoundError(notificationRepository.getEntityName(), id);
  }
  return updated;
}

async function markMultipleAsRead(ids: number[]) {
  return await Promise.all(ids.map((id) => markNotificationAsRead(id)));
}

export default {
  getById,
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markMultipleAsRead,
};
