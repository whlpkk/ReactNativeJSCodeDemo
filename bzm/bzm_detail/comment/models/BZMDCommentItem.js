/*
 * @providesModule BZMDCommentItem
 * @flow
 */
'use strict';

var BZMDCommentItem = function(object) {
  this.userNickname = object.userNickname;
  this.level = object.level;
  this.content = object.content;
  this.createTime = object.createTime;
  this.firstEvidence = object.firstEvidence;
  this.skuDesc = object.skuDesc;
  this.append = object.append;
  this.completeTime = object.completeTime;
  this.appendEvidence = object.appendEvidence;
  this.commentReplyContent = object.commentReplyContent;
  this.appendReplyContent = object.appendReplyContent;
};

module.exports = BZMDCommentItem;
