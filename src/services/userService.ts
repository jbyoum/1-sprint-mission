import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../config/constants';
import userRepository from '../repositories/userRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthError from '../lib/errors/UnauthError';
import { User } from '@prisma/client';

async function hashingPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

async function createUser(user: User) {
  const hashedPassword = await hashingPassword(user.password);
  const createdUser = await userRepository.create({
    ...user,
    password: hashedPassword,
  });
  return filterSensitiveUserData(createdUser);
}

async function getUser(email: string, password: string) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new UnauthError();
  }
  await verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
}

async function getUserById(id: number) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new NotFoundError(userRepository.getEntityName(), id);
  }

  return filterSensitiveUserData(user);
}

async function updateUser(id: number, data: Partial<User>) {
  const updatedUser = await userRepository.update(id, data);
  return filterSensitiveUserData(updatedUser);
}

async function updatePassword(id: number, password: string) {
  const hashedPassword = await hashingPassword(password);
  const updatedUser = await userRepository.update(id, { password: hashedPassword });
  return filterSensitiveUserData(updatedUser);
}

async function refreshToken(userId: number, refreshToken: string) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw new UnauthError();
  }
  const accessToken = createToken(user);
  const newRefreshToken = createToken(user, 'refresh');
  return { accessToken, newRefreshToken };
}

async function verifyPassword(inputPassword: string, savedPassword: string) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) {
    throw new UnauthError();
  }
}

function filterSensitiveUserData(user: Partial<User> = {}) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

function createToken(user: User, type?: String) {
  const payload = { userId: user.id };
  const options: SignOptions = {
    expiresIn: type === 'refresh' ? '2d' : '6h',
  };
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
}

export default {
  createUser,
  getUser,
  getUserById,
  updateUser,
  createToken,
  refreshToken,
  updatePassword,
};
