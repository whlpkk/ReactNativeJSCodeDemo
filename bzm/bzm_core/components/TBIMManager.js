/*
 * @providesModule TBIMManager
 * @flow
 */
'use strict';

var TBIMManager = require('NativeModules').TBIMManager;

module.exports = {

    openIMWithParameters: function(parameters: Object) {
      TBIMManager.openIMWithParameters(parameters);
    },
};
