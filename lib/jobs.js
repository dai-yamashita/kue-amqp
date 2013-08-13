require('../config/set_defaults');

var amqp = require('amqp-sqs')
  , CONFIG = require('config').kue
  , Job = require('./job')
  , logger = require('winston')
  , _ = require('underscore');

/**
 * A logging function that prefixes any message with the task type:
 */

function log(type){
  var args = Array.prototype.slice.call(arguments, 1);

  /**
   * Note that we replace the first parameter rather than inserting before it,
   * since it might contain formatting information. In other words, we want
   * this:
   *
   *  logger.info('ourtask: completed part %d of %d', part, total);
   *
   * rather than:
   *
   *  logger.info('ourtask:', 'completed part %d of %d', part, total);
   *
   * since the second version won't do proper formatting.
   */

  args[0] = type + ': ' + args[0];
  logger.info.apply(logger, args);
}

function Jobs(){

  /**
   * Establish a connection:
   */

  this.queueName = CONFIG.queueName;
  this.connection = amqp.createConnection({ });
  this.amqpIsReady = false;

  var self = this;
  this.connection.on('ready', function (err){
    if (!err){
      self.amqpIsReady = true;

      /**
       * Monitor the default queue:
       */

      self.connection.queue(self.queueName, function(err, q){
        q.subscribe(function (message, done){
          var type = message.type;

          if (!type){
            logger.error('A type is required.');
          } else {
            if (type in fnList){
              message.log = _.partial(log, type);
              fnList[type](message, function (err){
                if (err){
                  logger.error('Error processing: ', type, err);
                } else {
                  if (done){
                    done();
                  }
                  logger.debug('Processed: ', message);
                }
              });
            }
          }
        });
      });
    }
  });
}

Jobs.prototype._create = function(data){

  return new Job(this, data);
};

Jobs.prototype.create = function(type, data){

  /**
   * Push the job to queue:
   */

  return this._create({ 'type': type, 'data': data });
};

var fnList = [];

Jobs.prototype.process = function(type, parallel, callback){
  if (!callback){
    callback = parallel;
    parallel = null;
  }
  fnList[type] = callback;
};

exports = module.exports = Jobs;
