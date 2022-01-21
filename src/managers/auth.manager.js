import _ from 'lodash'
import bcrypt from 'bcryptjs'
import isEmail from 'validator/lib/isEmail'
import { MIN_PWD_LEN } from '../constants'

class AuthManager {

  constructor(user) {
    this.user = user
  }

  static isValidEmail(email) {
    return isEmail(email)
  }

  static isValidPassword(password) {
    return _.isString(password) && _.size(password) >= MIN_PWD_LEN
  }

  static hashPassword(password) {
    return {
      hash: bcrypt.hashSync(password, 10),
      alg: 'bcrypt',
    }
  }

  static authenticate(user, password) {
    if (!password || !user) {
      return false
    }
    return (
      user.alg === 'bcrypt' &&
      bcrypt.compareSync(password, user.password)
    )
  }

}

export default AuthManager