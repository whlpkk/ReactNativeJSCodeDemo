/*
 * @providesModule BZMUDealTagItem
 * @flow
 */
'use strict';

var BZMUDealTagItem = function(item) {
  this.id = item.id;
  this.tag_id = item.tag_id;
  this.parent_url_name = item.parent_url_name;
  this.category_name = item.category_name;
  this.url_name = item.url_name;
  this.category_desc = item.category_desc;
  this.query = item.query;
  this.pic = item.pic;
  this.now_count = item.now_count;
}

module.exports = BZMUDealTagItem;
