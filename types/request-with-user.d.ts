import { User } from '@prisma/client';
import { Request } from 'express';

declare global {
  type RequestWithUser = Request & {
    user?: User;
  };
}

export {};
