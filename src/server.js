import express from 'express'
import path from 'path'
import compress from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import config from './config'
import router from './api/router'
import * as passport from './passport'

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(helmet())
app.use(compress())
app.use(cors(config.cors))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(config.logFormat || 'short'))
// passport and session middlewares
passport.init(app)
app.use('/api', router)

app.listen(config.port, () =>
  console.log(`Server running on port ${config.port}`)
)