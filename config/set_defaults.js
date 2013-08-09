/**
 * Set the default configuration values:
 */

var CONFIG = require('config');

CONFIG.setModuleDefaults('kue', {
  queueName: 'kue'
});
