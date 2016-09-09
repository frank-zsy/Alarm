/**
 * Created by hzzhaoshengyu on 2016/9/8.
 */

$(document).ready(function (){

  var getMetrics = function () {
    var res = $.ajax({url:"/alarm/metrics", async:false});
    var metrics = res['responseText'];
    metrics = JSON.parse(metrics);
    return metrics['metrics'];
  };

  var refreshSelect = function () {
    var metrics = window.metrics;
    var selectors = $(".select_metric");
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

  $("#btn_add").click(function () {
    var row = "<tr><th><select class='select_metric'/></th><th><input class='input_condition'/></th><th><img class='btn_delete' src='/img/remove.png'></th></tr>";
    $("#settingTable").append(row);
    refreshSelect();
  });

  $("#btn_refresh").click(function () {
    window.metrics = getMetrics();
    refreshSelect();
  });

  $("#settingTable").on("click", "img", function () {
    $(this).parents('tr').empty();
  });

  window.metrics = getMetrics();
  refreshSelect();
});