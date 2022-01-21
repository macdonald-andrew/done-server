import { Router } from 'express'
import * as auth from '../handlers/auth.handlers'
import * as user from '../handlers/user.handlers'
import { validate } from '../../utils'

const router = new Router()

const validateProfile = validate(['firstName', 'lastName', 'dob', 'phoneNumber'])
const validateAddress = validate(['address'])
const validateAppointment = validate(['appointment'])

router.post('/create-profile', auth.checkAuth, validateProfile, user.createProfile)
router.post('/save-address', auth.checkAuth, validateAddress, user.saveAddress)
router.post('/license', auth.checkAuth, user.uploadLicense)
router.post('/appointment', auth.checkAuth, validateAppointment, user.createAppointment)

export default router