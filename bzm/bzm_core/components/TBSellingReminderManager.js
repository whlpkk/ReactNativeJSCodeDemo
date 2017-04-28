/*
 * @providesModule TBSellingReminderManager
 * @flow
 */
'use strict';

var TBSellingReminderManager = require('NativeModules').TBSellingReminderManager;

module.exports = {

  Successfully: TBSellingReminderManager.Successfully,
  Failed: TBSellingReminderManager.Failed,
  AllReadySet: TBSellingReminderManager.AllReadySet,
  NotificationUnavailable: TBSellingReminderManager.NotificationUnavailable,

  getSellingReminderState: function(
    dealId: Number,
    callBack: Function
  ){
    TBSellingReminderManager.getSellingReminderState(dealId, callBack);
  },

  settingStartSellingReminder: function(
    dealId: Number,
    beginTime: String,
    callBack: Function
  ){
    TBSellingReminderManager.settingStartSellingReminder(dealId, beginTime, callBack);
  },

  cancelStartSellingReminder: function(
    dealId: Number,
    beginTime: String,
    callBack: Function
  ){
    TBSellingReminderManager.cancelStartSellingReminder(dealId, beginTime, callBack);
  },

};
