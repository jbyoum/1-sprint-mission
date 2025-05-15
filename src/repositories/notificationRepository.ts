import { Prisma } from '@prisma/client';
import prisma from '../config/prismaClient';

async function getById(id: number) {
  return await prisma.notification.findUnique({
    where: {
      id,
    },
  });
}

async function create(alert: Prisma.NotificationUncheckedCreateInput) {
  return await prisma.notification.create({
    data: alert,
  });
}

async function getList(userId: number, onlyUnread: boolean = false) {
  return await prisma.notification.findMany({
    where: {
      userId,
      ...(onlyUnread ? { read: false } : {}),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async function setReadTrue(id: number) {
  return await prisma.notification.update({
    where: {
      id: id,
    },
    data: {
      read: true,
    },
  });
}

function getEntityName() {
  return prisma.notification.getEntityName();
}

export default {
  getById,
  create,
  getList,
  setReadTrue,
  getEntityName,
};
