/**
 * Created by hzzhaoshengyu on 2016/9/7.
 */
var bearcat = require('bearcat');
var fs = require('fs');
var logger = require('pomelo-logger').getLogger('san-alarm', 'dataService');

var DataService = function () {
  this.$id = "dataService";
  this.$init = 'init';
  this.data = null;
};

DataService.prototype.init = function () {
  this.data = {};
};

DataService.prototype.saveData = function (d, cb) {
  var self = this;
  var data = self.data;
  if (!d || d === {}) cb();
  Object.keys(d).forEach(function (metric) {
    if (!data[metric]) data[metric] = [];
    data[metric].push(d[metric]);
    if (data[metric].length() > 5) {
      data[metric].shift();
    }
  });
  cb();
};

DataService.prototype.readData = function () {
  return this.data;
};

module.exports = DataService;