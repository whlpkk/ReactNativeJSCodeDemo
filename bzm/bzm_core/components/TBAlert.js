/*
 *
 * @providesModule TBAlert
 */
'use strict';

var RCTTBAlertManager = require('NativeModules').TBAlertManager;
var invariant = require('invariant');

export type TBAlertType = $Enum<{
  'default': string;
  'check-button': string;
}>;

export type AlertButtonStyle = $Enum<{
  'default': string;
  'cancel': string;
  'destructive': string;
}>;

/**
 * Launches an alert dialog with the specified title and message.
 *
 * Optionally provide a list of buttons. Tapping any button will fire the
 * respective onPress callback and dismiss the alert. By default, the only
 * button will be an 'OK' button.
 *
 * ```
 * TBAlertIOS.alert(
 *   'Foo Title',
 *   'My Alert Msg',
 *   [
 *     {text: 'OK', onPress: () => console.log('OK Pressed')},
 *     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
 *   ]
 * )
 * ```
 */
class TBAlert {
  static alert(
    title: ?string,
    message?: ?string,
    buttons?: Array<{
      text?: string;
      onPress?: ?Function;
      style?: AlertButtonStyle;
    }>,
    type?: ?TBAlertType,
        detailAlign?: ?string
  ): void {
    var callbacks = [];
    var buttonsSpec = [];
    var cancelButtonKey;
    var destructiveButtonKey;
    buttons && buttons.forEach((btn, index) => {
      callbacks[index] = btn.onPress;
      if (btn.style == 'cancel') {
        cancelButtonKey = String(index);
      } else if (btn.style == 'destructive') {
        destructiveButtonKey = String(index);
      }
      if (btn.text || index < (buttons || []).length - 1) {
        var btnDef = {};
        btnDef[index] = btn.text || '';
        buttonsSpec.push(btnDef);
      }
    });
    RCTTBAlertManager.alertWithArgs({
      title: title || undefined,
      message: message || undefined,
      buttons: buttonsSpec,
      type: type || undefined,
      detailAlign: detailAlign || 'left',
      cancelButtonKey,
      destructiveButtonKey,
    }, (id, value) => {
      var cb = callbacks[id];
      cb && cb(value);
    });
  }

  static prompt(
    title: string,
    value?: string,
    buttons?: Array<{
      text?: string;
      onPress?: ?Function;
      style?: AlertButtonStyle;
    }>,
    callback?: ?Function
  ): void {
    if (arguments.length === 2) {
      if (typeof value === 'object') {
        buttons = value;
        value = undefined;
      } else if (typeof value === 'function') {
        callback = value;
        value = undefined;
      }
    } else if (arguments.length === 3 && typeof buttons === 'function') {
      callback = buttons;
      buttons = undefined;
    }

    invariant(
      !(callback && buttons) && (callback || buttons),
      'Must provide either a button list or a callback, but not both'
    );

    if (!buttons) {
      buttons = [{ onPress: callback }];
    }
    this.alert(title, value, buttons, 'plain-text');
  }
}

module.exports = TBAlert;
