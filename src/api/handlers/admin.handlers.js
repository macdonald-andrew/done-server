import _ from 'lodash'
import { asyncHandler, profileView } from '../../utils'
import db from '../../db'

export const getPatients = asyncHandler(async (req, res, next) => {
  const profiles =  await db.findAllProfiles()
  const response = _.map(profiles, e => profileView(e))
  res.json(response)
})