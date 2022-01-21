'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const LOG_FORMAT = ':remote-addr :date[clf] ":method :url" :status :res[content-length] ":referrer" ":user-agent" :response-time[1]';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4100,
  dbUri: process.env.MONGODB_URL || 'mongodb://localhost:27017/higherrewards',
  logFormat: 'short',
  cors: {
    origin: true,
    credentials: true
  },
  session: {
    secret: 'reVH0AGwqfh21bJglYTvDThB8S',
    maxAge: 90 * (24 * 60 * 60 * 1000)
  },
  apiUrl: '',
  credentialsKey: 'app'
};

const environments = {
  production: config => ({
    port: process.env.PORT || 80,
    logFormat: LOG_FORMAT
  }),

  onebox: config => ({
    port: process.env.PORT || 4100,
    usePublicFolder: 'public',

    dbUri: isMac ? 'mongodb://host.docker.internal:27017/dbname' : 'mongodb://localhost:27017/dbname',

    logFormat: LOG_FORMAT,

    proxyMap: {
      data_service: isMac ? 'http://host.docker.internal:6100' : 'http://localhost:6100',
      executor_service: isMac ? 'http://host.docker.internal:5100' : 'http://localhost:5100',
      notebook_service: isMac ? 'http://host.docker.internal:7100' : 'http://localhost:7100'
    }
  })
};

const overrides = environments[config.env];

if (overrides) {
  console.log(`Applying '${config.env}' environment overrides.`);
  console.log(`Platform ${process.platform}`);
  Object.assign(config, overrides(config));
}

exports.default = config;