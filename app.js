/**
 * Created by hzzhaoshengyu on 2016/9/6.
 */

var logger = require('pomelo-logger').getLogger('san-monitor', 'app');
var bearcat = require('bearcat');
//var argv = require('optimist').argv;

var contextPath = require.resolve('./context.json');

bearcat.createApp([contextPath]);

bearcat.start(function () {

  bearcat.getBean('alarmServer', 5555);

  process.env.BEARCAT_DEBUG = true;
});

// Uncaught exception handler
process.on('uncaughtException', function (err) {
  logger.error('Caught exception: ' + err.stack);
});