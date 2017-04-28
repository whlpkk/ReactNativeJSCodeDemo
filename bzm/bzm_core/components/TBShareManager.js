/*
 * @providesModule TBShareManager
 * @flow
 */
'use strict';

var TBShareManager = require('NativeModules').TBShareManager;

module.exports = {

    shareWithParameters: function(parameters: Object) {
      TBShareManager.shareWithParameters(parameters);
    },
};
