/*
 *
 * @providesModule TBLoading
 */
'use strict';

var RCTTBLoadingManager = require('NativeModules').TBLoadingManager;

/**
 * ```
 * TBLoading.popupLoading(
 *   'Foo Title',
 *   'success'
 * )
 * ```
 */
class TBLoading {
  static popupLoading(reactTag:number, text: string ): void {
    var callbacks = [];
    RCTTBLoadingManager.showPopupLoading(reactTag,{text: text  }, (id, value) => {
      var cb = callbacks[id];
      cb && cb(value);
    });
  }
  static hidePopupLoading(reactTag): void {
    var callbacks = [];
    RCTTBLoadingManager.hidePopupLoading(reactTag, (id, value) => {
      var cb = callbacks[id];
      cb && cb(value);
    });
  }
  static pageLoading(
    reactTag: number,
    frame: string,
    text?: ?string
  ): void {
    var callbacks = [];
    RCTTBLoadingManager.showPageLoading(reactTag,{
      frame: frame,
      text: text || undefined,
    }, (reactTag,id, value) => {
      var cb = callbacks[id];
      cb && cb(value);
    });
  }
  static hidePageLoading(reactTag: number): void {
    var callbacks = [];
    RCTTBLoadingManager.hidePageLoading(reactTag, { }, (id, value) => {
      var cb = callbacks[id];
      cb && cb(value);
    });
  }
}

module.exports = TBLoading;
