/*
 * @providesModule TBAnimation
 * @flow
 */
'use strict';

var TBAnimation = require('NativeModules').TBAnimationManager;

module.exports = {
    presentView: function (reactTag, targetTag) {
        TBAnimation.presentView(reactTag, targetTag);
    },
    dismissView: function (reactTag, closeCompletion: Function) {
        TBAnimation.dismissView(reactTag, closeCompletion);
    },
    imageViewer: function (reactTag, items, index) {
        TBAnimation.imageViewer(reactTag, items, index);
    },
    imageViewerMore: function (reactTag, items, index, scrollTip, moreTip, onMore: Function) {
        TBAnimation.imageViewerMore(reactTag, items, index, scrollTip, moreTip, onMore);
    }
};
