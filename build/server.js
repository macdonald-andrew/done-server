'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import router from './api/router'
// import auth from './api/auth/index'

const app = (0, _express2.default)();
// import session from 'cookie-session'
// import passport from 'passport'


app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));
app.use((0, _helmet2.default)());
app.use((0, _compression2.default)());
app.use((0, _cors2.default)(_config2.default.cors));
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: true }));
app.use((0, _morgan2.default)(_config2.default.logFormat || 'short'));
// app.use(session({
//   maxAge: 24 * 60 * 60 * 1000,
//   keys: [config.session.key]
// }))
// app.use(passport.initialize())
// app.use(passport.session())
// app.use('/api', router)

// mongoose.connect(config.dbUri, { useNewUrlParser: true }, (err) => {
//   if (err) {
//     console.error('Database connection failure:', err.message)
//     process.exit(1)
//   }
//   console.log('Connected to database', config.dbUri)
// })

app.listen(_config2.default.port, () => console.log(`Server running on port ${_config2.default.port}`));