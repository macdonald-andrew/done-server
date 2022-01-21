'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorMiddleware = exports.ApiError = exports.asyncHelper = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const asyncHelper = exports.asyncHelper = f => (req, res, next) => {
  f(req, res, next).catch(next);
};

class ApiError {
  constructor(message, status = 400) {
    this.message = message;
    this.status = status;
  }
}

exports.ApiError = ApiError;
const dupeError = ({ name, code }) => name === 'MongoError' && (code === 11000 || code === 11001);

const errorMiddleware = exports.errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (dupeError(err)) {
    return res.status(409).json({ message: 'Duplicate key error' });
  }
  if (err instanceof _mongoose2.default.Error.ValidationError) {
    return res.status(400).json({ message: _lodash2.default.map(err.errors, v => v.message)[0] });
  }
  console.error(err);
  res.status(500).json({ message: 'Server Error' });
};