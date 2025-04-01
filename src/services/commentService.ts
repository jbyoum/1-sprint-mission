import { Prisma } from '@prisma/client';
import commentRepository from '../repositories/commentRepository';

async function create(comment: Prisma.CommentUncheckedCreateInput) {
  return commentRepository.create(comment);
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
