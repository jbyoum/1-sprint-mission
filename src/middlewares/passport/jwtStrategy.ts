import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { JWT_SECRET, REFRESH_tOKEN_STRING } from '../../config/constants';
import userService from '../../services/userService';
import { Request } from 'express';

interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

const accessTokenOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};
const refreshTokenOptions = {
  jwtFromRequest: (req: Request) => req.cookies[REFRESH_tOKEN_STRING],
  secretOrKey: JWT_SECRET,
};
async function jwtVerify(payload: JwtPayload, done: VerifiedCallback) {
  try {
    const { userId } = payload;
    const user = await userService.getUserById(parseInt(userId));
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}

const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);
const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);

export default {
  accessTokenStrategy,
  refreshTokenStrategy,
};
