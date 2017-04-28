/**
 * @providesModule BZMCoreModel
 * @flow
 */
'use strict';
var BatchedBridge = require('BatchedBridge');
var BZMCoreModel = {

    nativeCallback: function (params:object) {
        var moduleName = params.moduleName;
        var methodName = params.methodName;

        for (var key in this.registerComponent) {
            if (key.startsWith(moduleName)) {
                this.registerComponent[key](methodName, params);
            }
        }
    }
};
BZMCoreModel.registerComponent = [];

BatchedBridge.registerCallableModule(
    'BZMCoreModel',
    BZMCoreModel
);

module.exports = BZMCoreModel;