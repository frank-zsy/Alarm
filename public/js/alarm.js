/**
 * Created by hzzhaoshengyu on 2016/9/8.
 */

$(document).ready(function (){

  var getMetricsAndAlarmInfo = function (cb) {
    $.ajax({
      url: '/alarm/alarmConfig',
      type: 'get',
      dataType: 'json',
      success: function (data) {
        cb(null, data);
      },
      error: function (data, statusCode, err) {
        cb(err, data);
      }
    });

  };

  var getNotifyConfig = function (cb) {
    $.ajax({
      url: '/alarm/notifyConfig',
      type: 'get',
      dataType: 'json',
      success: function (data) {
        cb(null, data);
      },
      error: function (data, statusCode, err) {
        cb(err, data);
      }
    });
  };

  var postAlarmCondition = function (data, cb) {
    console.log(data);
    $.ajax({
      url: '/alarm/alarmConfig',
      dataType: 'json',
      type: 'post',
      data: {data: data},
      success: function () {
        console.log('success');
        alert('Refresh succeed!');
      },
      error: function (data, statusCode, err) {
        console.log('data:' + JSON.stringify(data) + " ,statusCode:" + statusCode + ",err: " + JSON.stringify(err));
        alert('Refresh failed!');
      }
    });
  };

  var getMetricSuggestion = function (id) {
    var metrics = window.alarmInfo['metrics'];
    var ret = "<datalist id='" + id + "'>";
    metrics.forEach(function (metric) {
      ret += "<option>" + metric + "</option>";
    });
    ret += "</datalist>";
    return ret;
  };

  var getMetricMaxLength = function() {
    var metrics = window.alarmInfo['metrics'];
    var max = 0;
    metrics.forEach(function (metric) {
      if (metric.length > max) {
        max = metric.length;
      }
    });
    return max;
  };

  var refreshSelect = function () {
    var metrics = window.alarmInfo['metrics'];
    var selectors = $(".input_metric");
    selectors.each(function () {
      var selector = $(this);
      var val = selector.find("option:selected").val();
      selector.empty();
      metrics.forEach(function (metric) {
        var option;
        if (val === metric) {
          option = "<option value=" + metric  + " selected=\"selected\">" + metric + "</option>";
        } else {
          option = "<option value=" + metric + ">" + metric + "</option>";
        }
        selector.append(option);
      });
    });
  };

  var refreshTable = function () {
    getMetricsAndAlarmInfo(function (err, data) {
      if (err) return;
      window.alarmInfo = data;
      console.info(JSON.stringify(data));
      refreshSelect();
    });
  };

  var init = function () {
    $('tr').has('input').empty();
    getMetricsAndAlarmInfo(function (err, data) {
      if (err) return;

      if (!data['alarm']) return;

      data['alarm'].forEach(function (metric) {
        if (data['metrics'].indexOf(metric['metric']) === -1) {
          data['metrics'].push(metric['metric']);
        }
      });

      window.alarmInfo = data;
      console.info(JSON.stringify(data));
      data['alarm'].forEach(function (condition) {
        addRow(condition);
      });
    });
    getNotifyConfig(function (err, data) {
      if (err) return;

      if (!data['config']) return;

      window.notifyConfig = data['config'];

      // mail config
      var mailConfig = window.notifyConfig['mail'];
      $('#checkbox_email')[0].checked = mailConfig['enable'];
      $('#input_email_interval').val(mailConfig['interval']);
      mailConfig['to'].forEach(function (to) {
        var input = "<input class='notify-input' placeholder='Send alarm to...' value='" + to + "'><img class='img_notify_remove' src='/img/remove.png'>";
        $("#img_add_email").before(input);
        $(".img_notify_remove").click(removeNotifyInput);
      });

      // sms config
      var smsConfig = window.notifyConfig['sms'];
      $('#checkbox_sms')[0].checked = smsConfig['enable'];
      $('#input_sms_interval').val(smsConfig['interval']);
      smsConfig['to'].forEach(function (to) {
        var input = "<input class='notify-input' placeholder='Send alarm to...' value='" + to + "'><img class='img_notify_remove' src='/img/remove.png'>";
        $("#img_add_sms").before(input);
        $(".img_notify_remove").click(removeNotifyInput);
      });
    });
  };

  var addRow = function (condition) {
    var dataListId = "data_list";
    var row = "<tr>" +
                 "<th>" +
                  "<input class='input_metric' list='" + dataListId + "'";
    if (condition && condition['metric']) {
      row += " value='" + condition['metric'] + "'";
    }
    row += " size=" + getMetricMaxLength();
    row += ">";
    row += getMetricSuggestion(dataListId);
    row +=       "</th>" +
                 "<th>" +
                  "<input class='checkbox_change_rate' type='checkbox' ";
    if (condition && condition['change'] && condition['change'] == 'true') {
      row += "checked='checked'";
    }
    row +=       "/>" +
                 "</th>" +
                 "<th>" +
                   "<input class='input_condition' ";
    if (condition && condition['condition']) {
      row += "value='" + condition['condition'] + "'";
    } else {
      row += "placeholder='Input a formula here, use val to mean the metric value!'";
    }
    row +=       "/>" +
                 "</th>" +
                 "<th>" +
                   "<img class='btn_delete' src='/img/remove.png'>" +
                 "</th>" +
               "</tr>";
    $("#settingTable").append(row);
  };

  $("#btn_add").click(function () {
    addRow();
    refreshSelect();
  });

  $("#btn_refresh").click(refreshTable);

  $("#btn_alarm_submit").click(function () {
    var data = [];
    $("tr").has("input").each(function () {
      var metricCondition = {};
      var tr = $(this);
      metricCondition['metric'] = tr.find('.input_metric').val();
      metricCondition['change'] = tr.find('.checkbox_change_rate')[0].checked;
      metricCondition['condition'] = tr.find('.input_condition').val();
      data.push(metricCondition);
    });
    postAlarmCondition(data, function (data) {
      alert(data);
    })
  });

  $("#settingTable").on("click", "img", function () {
    $(this).parents('tr').empty();
  });

  $("#btn_alarm_restore").click(init);

  $("#menu_alarm_setting").click(function () {
    $("#alarm_div").css('display', 'block');
    $("#notify_div").css('display', 'none');
    $("#menu_alarm_setting").css('background','#f4f4f4');
    $("#menu_notify_setting").css('background', 'none');
  });

  $("#menu_notify_setting").click(function () {
    $("#alarm_div").css('display', 'none');
    $("#notify_div").css('display', 'block');
    $("#menu_alarm_setting").css('background','none');
    $("#menu_notify_setting").css('background', '#f4f4f4');
  });

  var removeNotifyInput = function () {
    $(this).prev(".notify-input").remove();
    $(this).remove();
  };

  $("#img_add_email").click(function () {
    var input = "<input class='notify-input' placeholder='Send alarm to...'><img class='img_notify_remove' src='/img/remove.png'>";
    $(this).before(input);
    $(".img_notify_remove").click(removeNotifyInput);
  });

  $("#img_add_sms").click(function () {
    var input = "<input class='notify-input'  placeholder='Send alarm to...'><img class='img_notify_remove' src='/img/remove.png'>";
    $(this).before(input);
    $(".img_notify_remove").click(removeNotifyInput);
  });

  $("#btn_notify_submit").click(function () {
    var config = {
      mail: {
        to: [],
        enable: false,
        interval: 0
      },
      sms: {
        to: [],
        enable: false,
        interval: 0
      }
    };

    config.mail.enable = $('#checkbox_email')[0].checked;
    config.mail.interval = $('#input_email_interval').val();
    $('#fieldset_email input').each(function () {
      config.mail.to.push($(this).val());
    });

    config.sms.enable = $('#checkbox_sms')[0].checked;
    config.sms.interval = $('#input_sms_interval').val();
    $('#fieldset_sms input').each(function () {
      config.sms.to.push($(this).val());
    });
    console.log(config);

    $.ajax({
      url: '/alarm/notifyConfig',
      dataType: 'json',
      type: 'post',
      data: {config: config},
      success: function () {
        console.log('success');
        alert('Refresh succeed!');
      },
      error: function (data, statusCode, err) {
        console.log('data:' + JSON.stringify(data) + " ,statusCode:" + statusCode + ",err: " + JSON.stringify(err));
        alert('Refresh failed!');
      }
    });

  });

  init();

});