/**
 * Created by hzzhaoshengyu on 2016/9/6.
 */

var logger = require('pomelo-logger').getLogger('san-alarm', 'AlarmRouter');
var express = require('express');

var AlarmRouter = function() {
  this.$id = "alarmRouter";
  this.$init = "init";
  this.router = null;
};

AlarmRouter.prototype.init = function () {
  var self = this;
  var router = express.Router();

  router.post('/data', function (req, res) {
    var params = req.body;
    logger.info(JSON.stringify(params));
    res.sendStatus(200);
  });

  router.get('/config', function (req, res) {
    res.send('This is the config web page');
  });

  self.router = router;
};

AlarmRouter.prototype.getRouter = function () {
  return this.router;
};

module.exports = AlarmRouter;
