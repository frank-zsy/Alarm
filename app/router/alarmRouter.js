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
      metrics: Object.keys(data),
      alarm: self.$configService.alarmConfig['alarmCondition']
    });
  });

  // Test setting page for alarm data
  router.post('/alarmConfig', function (req, res) {
    var data = req.body['data'];
    data.forEach(function (con) {
      if (typeof con['change'] === 'string') {
        con['change'] = (con['change'] === 'true');
      } else if (typeof con['change'] !== 'boolean') {
        con['change'] = false;
      }
    });
    self.$configService.alarmConfig.alarmCondition = data;

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

    self.$configService.notifyConfig['mail']['to'] = config['mail']['to'];
    if (typeof config['mail']['interval'] === "string") {
      self.$configService.notifyConfig['mail']['interval'] = parseInt(config['mail']['interval']);
    } else if (typeof config['mail']['interval'] === "number") {
      self.$configService.notifyConfig['mail']['interval'] = config['mail']['interval'];
    } else {
      self.$configService.notifyConfig['mail']['interval'] = 600;
    }
    if (typeof config['mail']['enable'] === "string") {
      self.$configService.notifyConfig['mail']['enable'] = (config['mail']['enable'] === "true");
    } else if (typeof config['mail']['enable'] === "boolean") {
      self.$configService.notifyConfig['mail']['enable'] = config['mail']['enable'];
    } else {
      self.$configService.notifyConfig['mail']['enable'] = false;
    }

    self.$configService.notifyConfig['sms']['to'] = config['sms']['to'];
    if (typeof config['sms']['interval'] === "string") {
      self.$configService.notifyConfig['sms']['interval'] = parseFloat(config['sms']['interval']);
    } else if (typeof config['sms']['interval'] === "number") {
      self.$configService.notifyConfig['sms']['interval'] = config['sms']['interval'];
    } else {
      self.$configService.notifyConfig['sms']['interval'] = 600;
    }
    if (typeof config['sms']['enable'] === "string") {
      self.$configService.notifyConfig['sms']['enable'] = (config['sms']['enable'] === "true");
    } else if (typeof config['sms']['enable'] === "boolean") {
      self.$configService.notifyConfig['sms']['enable'] = config['sms']['enable'];
    } else {
      self.$configService.notifyConfig['sms']['enable'] = false;
    }

    self.$configService.refreshConfig('notify', function (err) {
      if (err) res.json({success: false});
      else res.json({success: true});
    })
  });

  router.get('/rnd5w6gb', function (req, res) {
    res.json(self.$dataService.readData());
  });

  self.router = router;

};

AlarmRouter.prototype.getRouter = function () {
  return this.router;
};

module.exports = AlarmRouter;
