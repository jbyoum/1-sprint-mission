import { NextFunction, Request, Response } from 'express';

export function withAsync(
  handler: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>,
) {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      // if (req.user) {
      //   await handler(req as RequestWithUser, res, next);
      // } else {
      await handler(req, res, next);
      // }
    } catch (e) {
      next(e);
    }
  };
}
