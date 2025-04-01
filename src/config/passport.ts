import passport from 'passport';
import localStrategy from '../middlewares/passport/localStrategy';
import jwtStrategy from '../middlewares/passport/jwtStrategy';
import userRepository from '../repositories/userRepository';

passport.use('local', localStrategy);
passport.use('access-token', jwtStrategy.accessTokenStrategy);
passport.use('refresh-token', jwtStrategy.refreshTokenStrategy);

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
