/**
 * Created by hzzhaoshengyu on 2016/9/7.
 */
var bearcat = require('bearcat');
var fs = require('fs');
var logger = require('pomelo-logger').getLogger('san-alarm', 'dataService');

var DataService = function () {
  this.$id = "dataService";
};

module.exports = DataService;