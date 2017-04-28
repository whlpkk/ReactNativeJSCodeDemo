/*
 * @providesModule TBFacade
 * @flow
 */
'use strict';

var TBFacade = require('NativeModules').TBFacade;

module.exports = {
    nativeInfo: function (onSuccess:Function) {
        TBFacade.nativeInfo(onSuccess);
    },

    user: function (onSuccess:Function) {
        TBFacade.user(onSuccess);
    },
    forward: function (reactTag, urlString) {
        TBFacade.forward(reactTag, urlString);
    },
    goBack: function (reactTag) {
        TBFacade.goBack(reactTag);
    },
    setItem: function (storeKey, text, onSuccess:Function) {
        TBFacade.setItem(storeKey, text, onSuccess);
    },
    getItem: function (storeKey, onSuccess:Function) {
        TBFacade.getItem(storeKey, onSuccess);
    },
    removeItem: function (storeKey, onSuccess:Function) {
        TBFacade.removeItem(storeKey, onSuccess);
    },
    clear: function (onSuccess:Function) {
        TBFacade.clear(onSuccess);
    }
};
