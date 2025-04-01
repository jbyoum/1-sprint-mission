import { User } from '@prisma/client';

declare global {
  type UserWithId = { id: number } & Partial<Omit<User, 'id'>>;
}

export {};
