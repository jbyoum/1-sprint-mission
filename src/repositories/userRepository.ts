import prisma from '../config/prismaClient.js';

async function findById(id) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email) {
  return await prisma.User.findUnique({
    where: {
      email,
    },
  });
}

async function create(user) {
  return await prisma.user.create({
    data: user,
  });
}

async function update(id, data) {
  return await prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

function getEntityName() {
  return prisma.user.getEntityName();
}

export default {
  findById,
  findByEmail,
  create,
  update,
  getEntityName,
};
