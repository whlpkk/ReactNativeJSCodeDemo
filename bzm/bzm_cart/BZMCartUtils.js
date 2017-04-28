/*
 *
 * @providesModule BZMCartUtils
 */
'use strict';

var BZMCoreUtils = require('BZMCoreUtils');

class BZMCartUtils {
    static iconURL(urlPath):string {
        return BZMCoreUtils.baseICONPath()+"/bzm_cart/"+urlPath;
    }
}

module.exports = BZMCartUtils;
