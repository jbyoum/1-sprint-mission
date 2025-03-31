import { NextFunction, Request, Response } from 'express';

export function withAsync(
  handler: (req: Request | RequestWithUser, res: Response) => Promise<void>,
) {
  return async function (req: Request | RequestWithUser, res: Response, next: NextFunction) {
    try {
      await handler(req, res);
    } catch (e) {
      next(e);
    }
  };
}
