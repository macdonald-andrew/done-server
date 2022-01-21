import nodemon from 'nodemon'
import db from './index'
import { Role } from '../constants'

async function main() {

  // create user
  await db.createUser('test@gmail.com', '12345678', Role.User)

  // create admin
  await db.createUser('admin@gmail.com', '12345678', Role.Admin)

  // force a quit
  nodemon.emit('quit')
}

main()