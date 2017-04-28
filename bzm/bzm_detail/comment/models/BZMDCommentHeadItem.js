/*
 * @providesModule BZMDCommentHeadItem
 * @flow
 */
'use strict';

var BZMDCommentHeadItem = function(object) {
  this.totalNum = object.totalNum;
  this.goodCommentRate = object.goodCommentRate;
  this.middleCommentRate = object.middleCommentRate;
  this.negativeCommentRate = object.negativeCommentRate;

  this.countWithAppend = object.countWithAppend;
  this.countWithPic = object.countWithPic;

};

module.exports = BZMDCommentHeadItem;
