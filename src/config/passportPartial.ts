import { Request, Response, NextFunction } from 'express';
import passport from './passport';

export function authenticatePartial(strategyName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      strategyName,
      { session: false },
      (
        err: any,
        _user?: Express.User | false | null,
        _info?: object | string | Array<string | undefined>,
      ) => {
        if (err) {
          return next(err);
        }
        next();
      },
    )(req, res, next);
  };
}
