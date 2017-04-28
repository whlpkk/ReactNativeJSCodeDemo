/*
 * @providesModule BZMDCostEffectiveService
 * @flow
 */
'use strict';
var TBFacade = require('TBFacade');
var BZMCoreUtils = require('BZMCoreUtils');
var SWITCH_API_URL = 'http://th5.m.zhe800.com/h5/api/getdealperforandswtich?'

var BZMDCostEffectiveService = function(datas) {

      this.model = {
      code1: 1,//0--正常；非0--异常
      score :0,//性价比分
      ppDegree :1,//区间值
      ppDegreeContent :'',//映射到的区间对应的文案
      value:'0',//0:为未评价 1-5:为评价分数
      code2: 1,//0--正常；非0--异常
      showScoreSwitch: false,
      showCommentEntrySwitch: false,
      type:1,
    };

    this.setCompletionBlock = function(){

    };
    this.loadItem = function(){
      TBFacade.nativeInfo(function(dm){
        var  deviceId = dm.deviceId;
        var url = SWITCH_API_URL +'id=' + datas.deal.id
                + '&productId=' + datas.prod.productId
                + '&deviceId='+ deviceId;
        console.log(url);

        fetch(url)
          .then((response) => response.json())
          .catch((error) => {
            console.log('性价比开关获取失败');
          })
          .then((responseData) => {
            if (responseData== null) {
              return;
            }
              var bool1 = Boolean(responseData.costswitch);
              var bool2 = Boolean(responseData.ppswitch);
                // //        code1: 1,//0--正常；非0--异常
                //         score :0,//性价比分
                //         ppDegree :1,//区间值 大于等于2代表适中以上
                //         ppDegreeContent :'',//映射到的区间对应的文案
                //         value:'0',//0:为未评价 1-5:为评价分数
                //         code2: 1,//0--正常；非0--异常
              if (responseData.rst.result.code==0) {
                this.model.code = responseData.rst.result.code;
                this.model.score = responseData.rst.ppScores[0].score;
                this.model.ppDegree = responseData.rst.ppScores[0].ppDegree;
                this.model.ppDegreeContent = responseData.rst.ppScores[0].ppDegreeContent;
              }

              if (responseData.rst_cost != undefined) {
                if (responseData.rst_cost.result.code==0) {
                  this.model.value = responseData.rst_cost.value;
                  this.model.code2 = responseData.rst_cost.result.code;
                }

              }else {
                console.log('undefined');
              }

              this.model.showScoreSwitch = bool1;
              this.model.showCommentEntrySwitch = bool2;

              if (bool1 && bool2) {
                this.model.type = 2;//显示评分和评价入口
              }else if (!bool1 && bool2) {
                this.model.type = 1;//仅显示评价入口
              }
              this.setCompletionBlock();
          })
          .done();
      }.bind(this));
    }.bind(this);


};

module.exports = BZMDCostEffectiveService;
