import express from 'express'
import { errorHandler } from '../utils'
import auth from './routes/auth.routes'
import user from './routes/user.routes'
import admin from './routes/admin.routes'

const api = express.Router()

// health check
api.get('/health', (req, res) => res.send('ok'))

// set the limits of the request payload to 5MB.
api.use(express.json({ limit: '5mb' }))

//
// API routes
//

/* Authentication */

api.use('/auth', auth)


/* User */

api.use('/user', user)


/* Admin */

api.use('/admin', admin)

//
// Error handling
//

api.use((req, res) => res.status(404).json({ message: 'Not found' }))
api.use(errorHandler)

export default api