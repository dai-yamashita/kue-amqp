/**
 * Set up our server:
 */

var flatiron = require('flatiron')
  , app = flatiron.app;

app.use(flatiron.plugins.http);

/**
 * Allow the server to be started with 'app.listen(port)':
 */

module.exports = {
  listen: function (port){
    app.start(port);
  }
};


/**
 * A C T I O N S
 * =============
 */

var Jobs = require('./jobs')
  , jobs = new Jobs();

/**
 * Add a new job:
 */

app.router.post('/job', function () {
  var res = this.res;

  jobs._create(this.req.body).save(function (err, id){
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    if (err){
      res.end('error creating job:' + err);
    } else {
      res.end('job ' + id + ' created');
    }
  });
});
