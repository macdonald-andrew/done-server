import session from 'express-session'
import passport from 'passport'
import { Strategy } from 'passport-local'
import db from '../db'
import AuthManager from '../managers/auth.manager'
import config from '../config'
import { ApiError } from '../utils'

const serialize = (user, done) => {
  done(null, user.id)
}

const deserialize = async (id, done) => {
  const user = await db.getUserById(id)
  done(null, user)
}

const authenticateUser = async (email, password, done) => {
  try {
    const user = await db.getUserByEmail(email)
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' })
    }
    if (!AuthManager.authenticate(user, password)) {
      return done(null, false, { message: 'Incorrect password.' })
    }
    return done(null, user)
  } catch (err) {
    return done(err)
  }
}

passport.serializeUser(serialize)
passport.deserializeUser(deserialize)
passport.use(new Strategy({ usernameField: 'email' }, authenticateUser))

export const init = (app) => {
  // if application uses persistent login sessions, session() middlerware must be pass before passport.session()
  app.use(session(config.session))
  // required to initialize passport
  app.use(passport.initialize())
  // required if application uses persistent login sessions
  app.use(passport.session())
}

export const authenticate = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return next(new ApiError(info.message, 401))
    }
    req.logIn(user, () => {
      if (err) {
        return next(err)
      }
      return next()
    })
  })(req, res, next)
}




