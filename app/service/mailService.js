/**
 * Created by hzzhaoshengyu on 2016/9/7.
 */
var logger = require('pomelo-logger').getLogger('san-alarm', 'mailService');
var nodemailer = require('nodemailer');

var MailService = function () {
  this.$id = "mailService";
  this.$init = "init";
  this.$configService = null;
  this.transporter = null;
};

MailService.prototype.init = function () {
  var self = this;
  var mailConfig = self.$configService.mailConfig;
  self.transporter = nodemailer.createTransport(mailConfig['config']);
};

MailService.prototype.send = function (content, cb) {
  var self = this;
  var option = self.$configService.mailConfig['option'];

  option['subject'] = content['subject'];
  option['text'] = content['text'];

  self.transporter.sendMail(option, function (err, info) {
    if (cb) cb(err, info);
    else if (err) logger.error(err);
  });
};

module.exports = MailService;