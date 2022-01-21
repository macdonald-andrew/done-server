import _ from 'lodash'
import assert from 'assert'

export const asyncHandler = (f) => (req, res, next) => {
  f(req, res, next).catch(next)
}

export class ApiError {
  constructor(message, status = 400) {
    this.message = message
    this.status = status
  }
}

const validatePayload = (payload, arr) => {
  const failed = []
  for (let key of arr) {
    if (!payload[key]) {
      failed.push(key)
    }
  }
  return failed
}

// validate payload middleware - makes sure fields are present in the request body
export const validate = (fields = []) => (req, res, next) => {
  const failed = validatePayload(req.body, fields)
  if (_.size(failed) > 0) {
    return next(new ApiError(`Required fields missing from this request. Fields required: ${_.join(failed, ', ')}`, 400))
  }
  return next()
}

export const dupeError = ({ name, code }) =>
  name === 'Error' && code === 'P2002'

export const errorHandler = (err, req, res, next) => {
  console.error('error handler mw - ', err.message || err)
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message })
  }

  if (dupeError(err)) {
    return res.status(409).json({ message: 'Duplicate key error' })
  }

  if (err instanceof assert.AssertionError) {
    return res.status(409).json({ message: 'assert error' + err.message })
  }
  
  res.status(500).json({ message: 'Server Error' })
}

export const userView = (user) => {
  return _.pick(user, [
    'id',
    'email',
    'role'
  ])
}

export const cleanRecord = (rec) => _.isNil(rec) ? null : _.omit(rec, ['id', 'createdAt', 'updatedAt', 'profileId', 'userId'])

export const profileView = (profile) => {
  const user = userView(profile.user || {})
  const address = cleanRecord(profile.address)
  return _.chain(cleanRecord(profile))
    .omit('user')
    .merge(user)
    .set('address', address)
    .set('profileExists', true)
    .value()
}