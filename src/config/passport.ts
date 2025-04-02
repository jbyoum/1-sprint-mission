import passport from 'passport';
import localStrategy from '../middlewares/passport/localStrategy';
import jwtStrategy from '../middlewares/passport/jwtStrategy';
import userRepository from '../repositories/userRepository';
import { ACCESS_TOKEN_STRING, LOCAL_STRING, REFRESH_TOKEN_STRING } from './constants';
import UnauthError from '../lib/errors/UnauthError';
import { UserWithId } from '../../types/user-with-id';

passport.use(LOCAL_STRING, localStrategy);
passport.use(ACCESS_TOKEN_STRING, jwtStrategy.accessTokenStrategy);
passport.use(REFRESH_TOKEN_STRING, jwtStrategy.refreshTokenStrategy);

function isUserWithId(user: unknown): user is UserWithId {
  return (
    typeof user === 'object' &&
    user !== null &&
    'id' in user &&
    typeof (user as { id: unknown }).id === 'number'
  );
}
passport.serializeUser((user: unknown, done) => {
  if (isUserWithId(user)) {
    done(null, user.id);
  } else {
    done(new UnauthError());
  }
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await userRepository.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
