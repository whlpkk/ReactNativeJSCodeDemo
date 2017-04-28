/*
 *
 * @providesModule TBLogin
 */
'use strict';

var RCTTBPassportManager = require('NativeModules').TBPassportManager;
var invariant = require('invariant');

/**
 * ```
 * _onLoginSuccess: function(message) {
 *  },
 * TBLogin.popupLoading(
 * this._onLoginSuccess,
 * this._onLoginCancel
 * )
 * ```
 */

module.exports = {
  login: function(onSuccess: Function, onFailure: Function) {
    RCTTBPassportManager.login(onSuccess, onFailure);
  }
};
