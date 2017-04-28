/*
 * @providesModule BZMUDealThemeItem
 * @flow
 */
'use strict';
var BZMCoreUtils = require('BZMCoreUtils');


var BZMUDealThemeVo = function(text, imageUrl, textColor, bottomImage) {
  this.text = text;
  this.imageUrl = imageUrl;
  this.textColor = textColor;
  this.bottomImage = bottomImage;
};

var BZMUDealThemeItem = function() {

  var vos = [];
  vos.push(new BZMUDealThemeVo('最新上架', BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_new.jpg',
    '#B7767D', BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_bottom_new.png'));
  vos.push(new BZMUDealThemeVo('销量最高', BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_sale.jpg',
    '#00B68D', BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_bottom_sale.png'));
  vos.push(new BZMUDealThemeVo('明日预告', BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_tomorrow.jpg',
    '#40557B', BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_bottom_tomorrow.png'));
  this.vos = vos;
};

BZMUDealThemeItem.ThemeVo = BZMUDealThemeVo;
module.exports = BZMUDealThemeItem;
