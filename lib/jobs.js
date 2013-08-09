var amqp = require('amqp-sqs')
  Job = require('./job');

function Jobs(){

  /**
   * Establish a connection:
   */

  this.queueName = 'kue';
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
            console.log('A type is required.');
          } else {
            if (type in fnList){
              message.log = console.log;
              fnList[type](message, function (err){
                if (err){
                  console.log('Error processing: ', type, err);
                } else {
                  if (done){
                    done();
                  }
                }
              });
            }
          }
        });
      });
    }
  });
};

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
