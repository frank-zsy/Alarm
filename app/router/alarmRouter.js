/**
 * Created by hzzhaoshengyu on 2016/9/6.
 */

var logger = require('pomelo-logger').getLogger('san-alarm', 'AlarmRouter');
var express = require('express');
var bearcat = require('bearcat');
var fs = require('fs');

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

  // For receive and store the data from statsd alarm backend
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

  // config page
  router.get('/config', function (req, res) {
    res.send('This is the config web page');
  });

  // Test setting page
  router.get('/test', function (req, res) {
    res.render('test');
  });

  // Get metric and alarm info to initialize the page
  router.get('/alarmConfig', function (req, res) {
    var data = self.$dataService.readData();
    res.json({
      metrics: [
        "gauges.redis.miss.rate.redis-server-3",
        "gauges.redis.net.in.redis-server-3",
        "gauges.redis.miss.rate.redis-server-4"],
      alarm: self.$configService.alarmConfig['alarmCondition']
    });
  });

  // Test setting page for alarm data
  router.post('/alarmConfig', function (req, res) {
    self.$configService.alarmConfig.alarmCondition = req.body['data'];
    self.$configService.refreshConfig('alarm', function (err) {
      if (err) res.json({success: false});
      else res.json({success: true});
    });
  });

  router.get('/notifyConfig', function (req, res) {
    var config = {};
    config['mail'] = self.$configService.notifyConfig['mail'];
    config['sms'] = self.$configService.notifyConfig['sms'];
    res.json({config: config});
  });

  router.post('/notifyConfig', function (req, res) {
    var config = req.body['config'];
    if (!config) return res.statusCode(404);
    logger.info(JSON.stringify(config));
    self.$configService.notifyConfig['mail']['to'] = config['mail']['to'];
    self.$configService.notifyConfig['mail']['interval'] = config['mail']['interval'];
    self.$configService.notifyConfig['mail']['enable'] = config['mail']['enable'];
    self.$configService.notifyConfig['sms']['to'] = config['sms']['to'];
    self.$configService.notifyConfig['sms']['interval'] = config['sms']['interval'];
    self.$configService.notifyConfig['sms']['to'] = config['sms']['to'];
    self.$configService.refreshConfig('notify', function (err) {
      if (err) res.json({success: false});
      else res.json({success: true});
    })
  });

  self.router = router;

};

AlarmRouter.prototype.getRouter = function () {
  return this.router;
};

module.exports = AlarmRouter;
