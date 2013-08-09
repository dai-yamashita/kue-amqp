var CONFIG = require('config').kue;

function Job(jobs, data){
  this.jobs = jobs;
  this.data = data;
  this.options = { batchSize: 1 };
}

Job.prototype.save = function(callback){

  /**
   * Push the job to the 'kue' queue:
   */

  this.jobs.connection.publish(
    CONFIG.queueName
  , this.data
  , this.options
  , function (err){
    if (callback){
      callback(err, 'xyz');
    }
  });
};

exports = module.exports = Job;
