/*
 *
 * @providesModule BZMDCheapAmountType
 */
'use strict';

var BZMCoreUtils = require('BZMCoreUtils');

class BZMDCheapAmountType {

    static DEFAULT:number = 0;//默认 0：无；
    static YIYUAN:number = 1; //1：1元抢；
    static LIMIT:number = 2; //2：限时抢
    static LIJIAN:number = 3; //3：拍下立减
}

module.exports = BZMDCheapAmountType;
