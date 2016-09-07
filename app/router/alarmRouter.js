/**
 * Created by hzzhaoshengyu on 2016/9/6.
 */

var logger = require('pomelo-logger').getLogger('san-alarm', 'AlarmRouter');
var express = require('express');

var AlarmRouter = function() {
  this.$id = "alarmRouter";
  this.$init = "init";
  this.$configService = null;
  this.$dataService = null;
  this.router = null;
};

AlarmRouter.prototype.init = function () {
  var self = this;
  var router = express.Router();

  router.post('/data', function (req, res) {
    var params = req.body;

    var data = {};
    Object.keys(params).forEach(function (type) {
      if (self.$configService.dataConfig['alarmType'].indexOf(type) === -1) return;
      Object.keys(params[type]).forEach(function (metric) {
        var metricName = type + '.' + metric;
        data[metricName] = params[type][metric];
      });
    });

    // save data
    self.$dataService.saveData(data);
    // check data
    self.$dataService.checkData();

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
