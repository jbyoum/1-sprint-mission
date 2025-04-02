import { User } from '@prisma/client';

export type UserWithId = { id: number } & Partial<Omit<User, 'id'>>;

// declare global {
//   type UserWithId = { id: number } & Partial<Omit<User, 'id'>>;
// }

// export {};
