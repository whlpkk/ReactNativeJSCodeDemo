/*
 * @providesModule BZMDShopRateInfo
 * @flow
 */
'use strict';
var BZMCoreUtils = require('BZMCoreUtils');

var BZMDShopRateInfo = function(data,type) {
  var text ='';

  //限时抢商品，拍下立减商品不展示店铺优惠
	if (type !=undefined && type != 2 && type != 3) {
    if (data.result.code == 0) {
      if (data.discountInfo != null) {
        var youhui_type = data.discountInfo.type; //满减优惠类型
        var youhui_rule = data.discountInfo.rule; //满减优惠数据
        // [100-10,200-20,300-30]    满多少元，减多少元
        // [100-10]          满多少元，减多少元，上不封顶
        // [2-9,3-8,4-7]         满多少件，打多少折
        // [2]                    满多少件－免邮，
        // [200]              满多少元－免邮
        if (youhui_type == 2) {
          var t1_100_10 = youhui_rule.split("-");
          var t1_100 = parseFloat(t1_100_10[0]);
          var t1_10 = parseFloat(t1_100_10[1]);
          text += "满" + t1_100 + "元减" + t1_10 + "元,上不封顶";
        }
        if (youhui_type == 1) {
          var t2_arr = youhui_rule.split(",");
          var t2_100 = [],
            t2_10 = [];
          for (var i = 0; i < t2_arr.length; i++) {
            var t2_arr_arr = t2_arr[i].split("-");
            t2_100.push(t2_arr_arr[0]);
            t2_10.push(t2_arr_arr[1]);
          }
          for (var j = 0; j < t2_100.length; j++) {
            text += "满" + t2_100[j] + "元减" + t2_10[j] + "元•";
          }
          text = text.substring(0, text.length - 1);
        }

        if (youhui_type == 3) {
          var t2_arr = youhui_rule.split(",");
          var t2_100 = [],
            t2_10 = [];
          for (var i = 0; i < t2_arr.length; i++) {
            var t2_arr_arr = t2_arr[i].split("-");
            t2_100.push(t2_arr_arr[0]);
            t2_10.push(t2_arr_arr[1]);
          }
          for (var j = 0; j < t2_100.length; j++) {
            text += "满" + t2_100[j] + "件打" + t2_10[j] + "折•";
          }
          text = text.substring(0, text.length - 1);
        }
        if (youhui_type == 5) {
          text += "满" + youhui_rule + "元免邮";
        }
        if (youhui_type == 4) {
          text += "满" + youhui_rule + "件免邮";
        }

      }
  }
}
this.text = text;
};

module.exports = BZMDShopRateInfo;
