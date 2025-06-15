import { Notification, NotificationType } from '@prisma/client';
import CommonError from '../errors/CommonError';
import { JsonObject } from '@prisma/client/runtime/library';

export class CreateNotificationDTO {
  userId: number;
  payload: {
    message: string;
  };
  type: NotificationType;

  constructor(userId: number, content: string, type: NotificationType) {
    this.userId = userId;
    this.type = type;
    if (type === NotificationType.NEW_COMMENT) {
      this.payload = { message: `${content}게시글에 댓글이 달렸습니다.` };
    } else if (type === NotificationType.PRICE_CHANGE) {
      this.payload = { message: `${content}상품의 가격이 변경되었습니다.` };
    } else {
      throw new CommonError(`알림 타입이 잘못되었습니다.`, 400);
    }
  }
}

export class AlertNotificationDTO {
  userId: number;
  payload: Record<string, unknown>;
  type: NotificationType;
  createAt: Date;
  read: boolean;

  constructor(notification: Notification) {
    this.userId = notification.userId;
    this.type = notification.type;
    this.payload = notification.payload as JsonObject;
    this.createAt = notification.createdAt;
    this.read = notification.read;
  }
}
