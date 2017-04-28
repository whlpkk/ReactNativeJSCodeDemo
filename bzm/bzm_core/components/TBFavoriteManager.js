/*
 * @providesModule TBFavoriteManager
 * @flow
 */
'use strict';

var TBFavoriteManager = require('NativeModules').TBFavoriteManager;

module.exports = {

  getFavoriteState: function(
    dealId: Number,
    callBack: Function
  ){
    TBFavoriteManager.getFavoriteState(dealId, callBack);
  },

  onFavoritePress: function(
    dealId: Number,
    callBack: Function
  ){
    TBFavoriteManager.onFavoritePress(dealId, callBack);
  },

};
