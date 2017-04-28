/*
 * @providesModule BZMUDealHeadItem
 * @flow
 */
'use strict';
var BZMCoreUtils = require('BZMCoreUtils');

var BZMUDealHeadViewVo = function(text, imageUrl, textColor) {
  this.text = text;
  this.imageUrl = imageUrl;
  this.textColor = textColor;
};

var BZMUDealHeadItem = function() {
  var vos = [];
  vos.push(new BZMUDealHeadViewVo('97%好评', BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_head_reception.png'));
  vos.push(new BZMUDealHeadViewVo('24小时发货', BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_head_send.png'));
  vos.push(new BZMUDealHeadViewVo('精选爆款', BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_head_good.png'));
  this.vos = vos;
};

module.exports = BZMUDealHeadItem;
