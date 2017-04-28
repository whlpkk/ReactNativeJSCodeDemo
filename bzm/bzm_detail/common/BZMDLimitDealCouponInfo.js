/*
 * @providesModule BZMDLimitDealCouponInfo
 * @flow
 */
'use strict';
var BZMCoreUtils = require('BZMCoreUtils');

var BZMDLimitDealCouponInfo = function(data,type) {
  var price ='';
  var id = '';
  if (typeof data == "object" && data != null && data.Result_) {
    if (data.Result_.Code == 0) {
      if (data.ActivitysForProducts != null && data.ActivitysForProducts.length > 0) {
        var products = data.ActivitysForProducts;
        var showToUser_arr = [];
        var manjian_arr = [];
        var zhijian_arr = [];
        for (var i = 0; i < products.length; i++) {
          var showToUser = products[i].ShowToUser //是否展示给用户，0-不展示，1-展示
          if (showToUser == 1) {
            showToUser_arr.push(products[i]);
          }
        }

        for (var j = 0; j < showToUser_arr.length; j++) {
          var couponType = showToUser_arr[j].CouponType; //代金券类型 0-满减 1-直减
          if (couponType == 0) {
            manjian_arr.push(showToUser_arr[j]);
          } else {
            zhijian_arr.push(showToUser_arr[j]);
          }
        }

        //console.log(manjian_arr);
        //console.log(zhijian_arr);
        if (zhijian_arr.length > 0) {
          var max = zhijian_arr[0].Price;
          var _index = 0;
          for (var j = 0; j < zhijian_arr.length; j++) {
            var price = zhijian_arr[j].Price; //直减多少元
            if (parseFloat(price) >= parseFloat(max)) {
              max = price;
              _index = j;
            }
          }
          //console.log(max);
          //console.log(_index);
          var activityId = zhijian_arr[_index].FKey;

          price = zhijian_arr[_index].Price;
          id = activityId;
        }
      }
    }
  }
  this.price = price;
  this.activityId = id;
};

module.exports = BZMDLimitDealCouponInfo;
