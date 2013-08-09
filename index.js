var Jobs = require('./lib/jobs');

module.exports = {
  app: require('./lib/api')
, createQueue: function (){
    return new Jobs();
  }
};
