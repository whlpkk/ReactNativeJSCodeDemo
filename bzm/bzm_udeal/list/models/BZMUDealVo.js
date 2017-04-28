/*
 * @providesModule BZMUDealVo
 * @flow
 */
'use strict';

var BZMUDealVo = function(deal) {
  if (!deal) {
    return;
  }
  this.id = deal.id;
  this.title = deal.title;
  this.short_title = deal.short_title;
  this.oos = deal.oos;
  this.recommend_reason = deal.recommend_reason;
  this.list_price = deal.list_price;
  this.price = deal.price;
  this.begin_time = deal.begin_time;
  this.expire_time = deal.expire_time;
  this.today = deal.today;
  this.wap_url = deal.wap_url;
  this.share_url = deal.share_url;
  this.baoyou = deal.baoyou;
  this.fanjifen = deal.fanjifen;
  this.huiyuangou = deal.huiyuangou;
  this.zhuanxiang = deal.zhuanxiang;
  this.promotion = deal.promotion;
  this.coupon_infos = deal.coupon_infos;
  this.pic_width = deal.pic_width;
  this.pic_height = deal.pic_height;
  this.shop_type = deal.shop_type;
  this.deal_type = deal.deal_type;
  this.image_url = deal.image_url;
  this.square_image = deal.square_image;
  this.image_share = deal.image_share;
  this.detail_url = deal.detail_url;
  this.scores = deal.scores;
  this.source_type = deal.source_type;
  this.zid = deal.zid;
  this.sales_count = deal.sales_count;
  this.brand_id = deal.brand_id;
  this.brand_product_type = deal.brand_product_type;
  this.little_story = deal.little_story;
  this.youpin_type = deal.youpin_type;
  this.standard = deal.standard;
  this.is_star = deal.is_star;
  this.good_comment_rate = deal.good_comment_rate;
};

module.exports = BZMUDealVo;
