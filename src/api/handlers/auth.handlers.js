import _ from 'lodash'
import AuthManager from '../../managers/auth.manager'
import { asyncHandler, ApiError, dupeError, userView, profileView } from '../../utils'
import db from '../../db'
import { Role } from '../../constants'

export const user = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError('User does not exist.', 400)
  }

  const profile = await db.getProfileByEmail(req.user.email)
  if (profile) {
    return res.json(profileView(profile))
  }
  res.json(userView(req.user))
})

export const signup = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!AuthManager.isValidEmail(email)) {
    throw new ApiError('Invalid email.', 400)
  }

  if (!AuthManager.isValidPassword(password)) {
    throw new ApiError('Invalid password.', 400)
  }

  const user = await db.createUser(email, password)
    .catch(err => {
      if (dupeError(err)) {
        throw new ApiError('Email already exists.', 409)
      }
    })

  res.json(userView(user))
})

export const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return next(new ApiError('Authentication required', 401))
}

export const checkAdminRole = (req, res, next) => {
  if (_.get(req, ['user', 'role']) === Role.Admin) {
    return next()
  }
  return next(new ApiError('Admin role required.', 401))
}

export const signout = async (req, res, next) => {
  await req.logOut()
  res.json({})
}