/**
 * Created by hzzhaoshengyu on 2016/9/7.
 */

var bearcat = require('bearcat');
var logger = require('pomelo-logger').getLogger('san-alarm', 'configService');

var ConfigService = function () {
  this.$id = "configService";
  this.$init = "init";
  this.loadPath = process.cwd() + '/config/' + bearcat.getApplicationContext().getEnv() + '/';
  this.dataConfig = require(this.loadPath + 'data.json');
  this.alarmConfig = require(this.loadPath + 'alarm.json');
  this.mailConfig = require(this.loadPath + 'mail.json');
};

ConfigService.prototype.init = function () {
  logger.info("start init config service");
};

module.exports = ConfigService;
