/*
 * @providesModule TBExposureManager
 * @flow
 */
'use strict';

var TBExposureManager = require('NativeModules').TBExposureManager;

module.exports = {

    exposureItems: function(
        dealVo: Object ={},
        appearTime: String ="",
        pageId: String ="",
        pageName:String ="")
    {
      var sortId = 0; //该参数已经不需要，继续传是为了兼容老版本
      TBExposureManager.exposureItems(dealVo,sortId,appearTime,pageId,pageName);
    },

    pushLogForPageName: function(
      pageName :String,
      pageId: String,
      modelIndex: Number,
      modelVo: Object)
    {
      TBExposureManager.pushLogForPageName(pageName,pageId,modelIndex,modelVo);
    },

    tapPageName: function(
      pageName: String,
      pageId: String,
      modelIndex: Number,
      modelVo: Object)
    {
      TBExposureManager.tapPageName(pageName,pageId,modelIndex,modelVo);
    },

    appendOutUrl: function(
      urlStr: String,
      dealId: String,
      callBack: Function)
    {
      TBExposureManager.appendOutUrl(urlStr,dealId,callBack);
    },

    paramsLogWithEventId: function(
      eventid: String,
      params: Object)
    {
      TBExposureManager.paramsLogWithEventId(eventid,params);
    },

};
