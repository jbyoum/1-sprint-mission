import { Comment, NotificationType, Prisma } from '@prisma/client';
import commentRepository from '../repositories/commentRepository';
import articleRepository from '../repositories/articleRepository';
import { emitAlertToUser } from '../sockets/handlers/notificationHandler';
import notificationService from './notificationService';
import { CreateCommentDTO } from '../lib/dtos/CommentDTO';
import productRepository from '../repositories/productRepository';

async function handleNotification(comment: Comment) {
  if (!comment.articleId) return;

  const article = await articleRepository.getById(comment.articleId);
  if (!article) return;

  const notification = await notificationService.createNotification(
    article.userId,
    `${article.title} 게시글에 댓글이 달렸습니다.`,
    NotificationType.NEW_COMMENT,
  );
  if (process.env.NODE_ENV !== 'test') emitAlertToUser(article.userId, notification);
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

  let ownerId: number | undefined;
  if (articleId || productId) {
    const [article, product] = await Promise.all([
      articleId ? articleRepository.getById(articleId) : Promise.resolve(null),
      productId ? productRepository.getById(productId) : Promise.resolve(null),
    ]);
    ownerId = article?.userId ?? product?.userId;
  }
  if (ownerId !== userId) {
    handleNotification(comment).catch((error) => {
      if (process.env.NODE_ENV !== 'test')
        console.error('Error handling comment notification:', error);
    });
  }

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
