import commentRepository from '../repositories/commentRepository.js';

async function create(comment) {
  return commentRepository.create(comment);
}

async function getById(id) {
  return commentRepository.getById(id);
}

async function getAll() {
  return commentRepository.getAll();
}

async function getList(data) {
  return commentRepository.getList(data);
}

async function update(id, comment) {
  return commentRepository.update(id, comment);
}

async function deleteById(id) {
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
