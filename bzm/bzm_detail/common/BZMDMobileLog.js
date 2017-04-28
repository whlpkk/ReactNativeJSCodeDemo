/*
 *
 * @providesModule BZMDMobileLog
 */
'use strict';

var BZMCoreUtils = require('BZMCoreUtils');
var TBExposureManager = require('TBExposureManager');

class BZMDMobileLog {

    static pageName: string = "detai";
    static pageId(dealId) {
        var pageName = BZMDMobileLog.pageName;
        var pageId = pageName+"_"+String(dealId);
        return pageId;
    }

    /* var modelVo = {
     *   analysisId: deal.id,
     *   analysisType: 'deallist',
     *   analysisIndex: sortId,
     *   analysisSourceType: '2',
     * };
    */
    static pushLogForPageName(dealId,modelVo,modelIndex=0) {
        var pageName = BZMDMobileLog.pageName;
        var pageId = BZMDMobileLog.pageId(dealId);
        TBExposureManager.pushLogForPageName(pageName,pageId,modelIndex,modelVo)
    }
}

module.exports = BZMDMobileLog;
