import AuthManager from '../managers/auth.manager'
import { Role } from '../constants'

class DatabaseClient {
  constructor(prisma) {
    this.prisma = prisma
  }

  execute(fn, data) {
    return fn(data)
      .catch((e) => {
        throw e
      })
      .finally(async () => {
        await this.prisma.$disconnect()
      })
  }

  createUser(email, password, role = Role.User) {
    const { hash, alg } = AuthManager.hashPassword(password)
    return this.execute(this.prisma.user.create, {
      data: {
        email,
        role,
        alg,
        password: hash
      }
    })
  }

  createProfile(email, firstName, lastName, dob, phoneNumber) {
    return this.execute(this.prisma.profile.create, {
      data: {
        firstName,
        lastName,
        dob,
        phoneNumber,
        user: {
          connect: { email }
        }
      },
      include: {
        user: true,
        address: true
      },
    })
  }

  updateProfile(userId, data) {
    return this.execute(this.prisma.profile.update, {
      data,
      where: {
        userId
      },
      include: {
        user: true,
        address: true
      },
    })
  }

  saveAddress(userId, address, latitude, longitude, placeId) {
    return this.execute(this.prisma.address.create, {
      data: {
        address,
        latitude,
        longitude,
        placeId,
        profile: {
          connect: { userId }
        }
      },
    })
  }

  getUserByEmail(email) {
    return this.execute(this.prisma.user.findUnique, {
      where: {
        email,
      }
    })
  }

  getUserById(id) {
    return this.execute(this.prisma.user.findUnique, {
      where: {
        id,
      }
    })
  }

  getProfileByEmail(email) {
    return this.execute(this.prisma.profile.findFirst, {
      where: {
        user: {
          email
        }
      },
      include: {
        user: true,
        address: true
      },
    })
  }

  findAllProfiles() {
    return this.execute(this.prisma.profile.findMany, {
      include: {
        user: true,
        address: true
      }
    })
  }

  findAllUsers() {
    return this.execute(this.prisma.user.findMany, {
      include: {
        profile: true,
      }
    })
  }
}

export default DatabaseClient