/**
 * Set the default configuration values:
 */

var CONFIG = require('config');

CONFIG.setModuleDefaults('kue', {
  queueName: 'kue'
});

var Jobs = require('./lib/jobs');

module.exports = {
  app: require('./lib/api')
, createQueue: function (){
    return new Jobs();
  }
};
