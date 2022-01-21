import _ from 'lodash'
import { asyncHandler, ApiError, dupeError, profileView, cleanRecord } from '../../utils'
import db from '../../db'
import upload from '../../managers/file.manager'
import multer from 'multer'

export const createProfile = asyncHandler(async (req, res, next) => {
  // TODO - validate fields. For now, we will assume the user will not bypass the FE validation.
  const email = _.get(req, ['user', 'email'])
  const { firstName, lastName, dob, phoneNumber } = req.body

  const profile = await db.createProfile(email, firstName, lastName, dob, phoneNumber)
    .catch(err => {
        if (dupeError(err)) {
          throw new ApiError('Profile for this user already exists.', 409)
        }
      })

  res.json(profileView(profile))
})

export const saveAddress = asyncHandler(async (req, res, next) => {
  const userId = _.get(req, ['user', 'id'])
  const { address, location, placeId } = req.body

  const args = [userId, address]

  if (location) {
    const latitude = _.get(location, 'lat')
    const longitude = _.get(location, 'lng')
    args.push(_.toString(latitude))
    args.push(_.toString(longitude))
  }
  
  if (placeId) {
    args.push(placeId)
  }

  const record = await db.saveAddress(...args)
    .catch(err => {
        if (dupeError(err)) {
          throw new ApiError('Address for this user already exists.', 409)
        }
      })

  res.json(cleanRecord(record))
})


export const uploadLicense = (req, res, next) => {
  const userId = _.get(req, ['user', 'id'])

  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json(err)
    }
    const license = _.get(req, ['file', 'originalname'])
    const profile = await db.updateProfile(userId, { license })
    return res.json(profileView(profile))
  })

}

export const createAppointment = asyncHandler(async (req, res, next) => {
  const userId = _.get(req, ['user', 'id'])
  const { appointment } = req.body

  const profile = await db.updateProfile(userId, { appointment })
  return res.json(profileView(profile))
  
})