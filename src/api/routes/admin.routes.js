import { Router } from 'express'
import * as auth from '../handlers/auth.handlers'
import * as admin from '../handlers/admin.handlers'

const router = new Router()

router.get('/patients', auth.checkAuth, auth.checkAdminRole, admin.getPatients)

export default router