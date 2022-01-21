import { PrismaClient } from '@prisma/client'
import DatabaseClient from './client'

const prisma = new PrismaClient()

const client = new DatabaseClient(prisma)

export default client