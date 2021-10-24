const failmenot = require('./');

module.exports = (options) => (fn) => (...args) =>
  failmenot(options, fn, ...args);
