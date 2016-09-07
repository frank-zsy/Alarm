/**
 * Created by hzzhaoshengyu on 2016/9/7.
 */
var bearcat = require('bearcat');
var fs = require('fs');
var logger = require('pomelo-logger').getLogger('san-alarm', 'mailService');

var MailService = function () {
  this.$id = "mailService";
};

MailService.prototype.init = function () {
};

module.exports = MailService;