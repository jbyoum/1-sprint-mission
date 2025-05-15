import { Comment, NotificationType, Prisma } from '@prisma/client';
import commentRepository from '../repositories/commentRepository';
import articleRepository from '../repositories/articleRepository';
import { emitAlertToUser } from '../sockets/handlers/notificationHandler';
import notificationService from './notificationService';
import { CreateCommentDTO } from '../lib/dtos/CommentDTO';

async function handleNotification(comment: Comment) {
  if (!comment.articleId) return;

  const article = await articleRepository.getById(comment.articleId);
  if (!article) return;

  const notification = await notificationService.createNotification(
    article.userId,
    `${article.title} 게시글에 댓글이 달렸습니다.`,
    NotificationType.NEW_COMMENT,
  );
  emitAlertToUser(article.userId, notification);
}

async function create(
  content: string,
  userId: number,
  articleId: number | null = null,
  productId: number | null = null,
) {
  const comment = await commentRepository.create(
    new CreateCommentDTO(content, userId, articleId, productId),
  );
  handleNotification(comment).catch((error) => {
    console.error('Error handling comment notification:', error);
  });
  return comment;
}

async function getById(id: number) {
  return commentRepository.getById(id);
}

async function getAll() {
  return commentRepository.getAll();
}

async function getList(data: Prisma.CommentFindManyArgs) {
  return commentRepository.getList(data);
}

async function update(id: number, comment: Prisma.CommentUncheckedUpdateInput) {
  return commentRepository.update(id, comment);
}

async function deleteById(id: number) {
  return commentRepository.deleteById(id);
}

function getEntityName() {
  return commentRepository.getEntityName();
}

export default {
  create,
  getById,
  getAll,
  getList,
  update,
  deleteById,
  getEntityName,
};
