/**
 * Created by hzzhaoshengyu on 2016/9/7.
 */
var bearcat = require('bearcat');
var fs = require('fs');
var logger = require('pomelo-logger').getLogger('san-alarm', 'dataService');

var DataService = function () {
  this.$id = "dataService";
  this.$init = 'init';
  this.$configService = null;
  this.$mailService = null;
  this.data = null;
};

DataService.prototype.init = function () {
  this.data = {};
};

DataService.prototype.saveData = function (d) {
  var self = this;
  var data = self.data;
  if (!d || d === {}) return;
  Object.keys(d).forEach(function (metric) {
    if (!data[metric]) data[metric] = [];
    data[metric].push(d[metric]);
    if (data[metric].length > self.$configService.dataConfig['saveLength']) {
      data[metric].shift();
    }
  });
};

DataService.prototype.checkData = function () {
  var self = this;
  var alarmCondition = self.$configService.alarmConfig['alarmCondition'];
  var data = self.data;

  alarmCondition.forEach(function (item) {
    var metric = item['metric'];
    var condition = item['condition'];
    var change = item['change'];

    if (condition.indexOf('val') === -1) {
      condition = 'val' + condition;
    }

    var val = self.data[metric][self.data[metric].length - 1];

    if (change) {} else {
      if (eval(condition)) {
        logger.info('Alarm! ' + condition + ' meet!');
        //self.$mailService.send({subject: "Alarm from sanl11", text: "Alarm triggered!"});
      }
    }
  });

};

DataService.prototype.readData = function () {
  return this.data;
};

module.exports = DataService;
