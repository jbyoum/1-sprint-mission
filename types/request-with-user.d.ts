import { Request } from 'express';
import { User } from '@prisma/client';

declare global {
  // namespace Express {
  //   interface Request {
  //     user?: Partial<User>;
  //   }
  // }
  // interface RequestWithUser extends Request {
  //   user: User;
  // }
  type RequestWithUser = Request & { user: User };
}

export {};
