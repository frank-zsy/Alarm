/**
 * Created by hzzhaoshengyu on 2016/9/6.
 */

var logger = require('pomelo-logger').getLogger('san-alarm', 'AlarmServer');
var express = require('express');
var bearcat = require('bearcat');
var bodyParser = require('body-parser');
var rootdir = process.cwd();
var http = require('http');

var AlarmServer = function(port) {
  this.$id = "alarmServer";
  this.$lazy = true;
  this.$init = "init";
  this.$alarmRouter = null;
  this.app = null;
  this.port = port;
};

AlarmServer.prototype.init = function() {

  var self = this;
  var app = express();

  // parser for application/json
  app.use(bodyParser.json());
  // parser for application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));
  // parser for query
  app.use(express.query());

  app.set('port', self.port);
  app.enable('trust proxy');

  app.use('/alarm', self.$alarmRouter.getRouter());

  this.app = app;

  http.createServer(app).listen(app.get('port'), function() {
    logger.info("http server started on pid: %s with port : %s", process.pid, app.get('port'));
  });
};

module.exports = AlarmServer;
