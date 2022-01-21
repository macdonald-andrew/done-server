import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4100,
  dbUri: process.env.DATABASE_URL || 'postgresql://db_user:db_password@localhost:5432/db_name',
  logFormat: 'short',
  cors: {
    origin: true,
    credentials: true,
  },
  session: {
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 90 * (24 * 60 * 60 * 1000)
    },
  },
}

export default config