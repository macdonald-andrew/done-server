import { Router } from 'express'
import * as auth from '../handlers/auth.handlers'
import * as passport from '../../passport'
import { validate } from '../../utils'

const router = new Router()

const validateCredentials = validate(['email', 'password'])

router.get('/user', auth.user)
router.post('/signin', validateCredentials, passport.authenticate, auth.user)
router.post('/signup', validateCredentials, auth.signup)
router.post('/signout', auth.signout)

export default router