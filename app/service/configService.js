/**
 * Created by hzzhaoshengyu on 2016/9/7.
 */

var bearcat = require('bearcat');
var logger = require('pomelo-logger').getLogger('san-alarm', 'configService');
var fs = require('fs');

var ConfigService = function () {
  this.$id = "configService";
  this.$init = "init";
  this.type = ['alarm', 'data', 'notify'];
  this.loadPath = process.cwd() + '/config/' + bearcat.getApplicationContext().getEnv() + '/';
  this.dataConfig = require(this.loadPath + 'data.json');
  this.alarmConfig = require(this.loadPath + 'alarm.json');
  this.notifyConfig = require(this.loadPath + 'notify.json');
};

ConfigService.prototype.init = function () {
};

ConfigService.prototype.refreshConfig = function (which, cb) {
  var self = this;
  if (self.type.indexOf(which) !== -1) {
    var configName = which + 'Config';
    var config = self[configName];
    var file = self.loadPath + which + '.json';
    fs.writeFile(file, JSON.stringify(config), function (err, written, string) {
      if (err) {
        logger.info(err);
        return cb(err);
      }
      self.reload(which);
      return cb();
    });
  }
};

ConfigService.prototype.reload = function (which) {
  var self = this;
  if (self.type.indexOf(which) !== -1) {
    delete require.cache[require.resolve(this.loadPath + which + '.json')];
    this[which + 'Config'] = require(this.loadPath + which + '.json');
  }
};

module.exports = ConfigService;
