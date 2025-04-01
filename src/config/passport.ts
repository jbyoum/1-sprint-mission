import passport from 'passport';
import localStrategy from '../middlewares/passport/localStrategy';
import jwtStrategy from '../middlewares/passport/jwtStrategy';
import userRepository from '../repositories/userRepository';
import { ACCESS_TOKEN_STRING, LOCAL_STRING, REFRESH_TOKEN_STRING } from './constants';

passport.use(LOCAL_STRING, localStrategy);
passport.use(ACCESS_TOKEN_STRING, jwtStrategy.accessTokenStrategy);
passport.use(REFRESH_TOKEN_STRING, jwtStrategy.refreshTokenStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userRepository.findById(parseInt(id));
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
