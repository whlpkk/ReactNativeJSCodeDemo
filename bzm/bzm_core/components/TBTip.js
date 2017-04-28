/*
 *
 * @providesModule TBTip
 */
'use strict';

var RCTTBTipManager = require('NativeModules').TBTipManager;
var invariant = require('invariant');

export type TBTipType = $Enum<{
  'default': string;
  'success': string;
  'fail': string;
}>;
/**
 * ```
 * TBTip.show(
 *   'Foo Title',
 *   'success'
 * )
 * ```
 */
class TBTip {
  static show(
    title: ?string,
    type?: ?TBAlertType
  ): void {
    var callbacks = [];
    RCTTBTipManager.showTip({
      title: title || undefined,
      type: type || undefined,
    }, (id, value) => {
      var cb = callbacks[id];
      cb && cb(value);
    });
  }

}

module.exports = TBTip;
