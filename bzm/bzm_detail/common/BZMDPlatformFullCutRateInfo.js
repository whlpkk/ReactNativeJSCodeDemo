
  /*
   * @providesModule BZMDPlatformFullCutRateInfo
   * @flow
   */
  'use strict';
  var BZMCoreUtils = require('BZMCoreUtils');

  var BZMDPlatformFullCutRateInfo = function(favor_deal,type) {
    this.text = '';
    this.activityId = '';
    var htmlstr = "";
    //平台满减优惠
    if (favor_deal.activity) { //activity 平台优惠
      if (favor_deal.activity.activityType == 1) { // activityType 活动类型： 默认 1:满减
        var activityRules = favor_deal.activity.activityRules; //活动规则 格式:100-5,150-10,200-30
        var activityId = favor_deal.activity.id; // 活动ID
        var t1_arr = activityRules.split(",");
        var t1_100 = [],
          t1_10 = [];
        for (var j = 0; j < t1_arr.length; j++) {
          var t1_arr_arr = t1_arr[j].split("-");
          t1_100.push(t1_arr_arr[0]);
          t1_10.push(t1_arr_arr[1]);
        }
        for (var j = 0; j < t1_100.length; j++) {
          htmlstr += "满" + t1_100[j] + "元减" + t1_10[j] + "元，";
        }
        htmlstr = htmlstr.substring(0, htmlstr.length - 1);
      }
    }
    this.text = htmlstr;
    this.activityId = activityId;
  };

  module.exports = BZMDPlatformFullCutRateInfo;
