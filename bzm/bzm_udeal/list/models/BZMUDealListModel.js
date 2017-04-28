/*
 * @providesModule BZMUDealListModel
 * @flow
 */
'use strict';

var BZMUDealGridItem = require('BZMUDealGridItem');
var TBExposureManager = require('TBExposureManager')

var BZMUDealListModel = function() {

  this.hasNext = false;
  this.loading = false;
  this.pageNumber = 1;
  this.pageSize = 20;
  this.items = [];
  this.vos = [];

  this.tagUrlName = '';
  this.offset = 0;
  this.previous_y = 0;

  this.pageName = 'youph';

  this.checkExposureItems = function(){
    // 进入曝光
    var pageName = this.pageName;
    var pageId = this.pageName+'_'+this.tagUrlName;

    for (var index in this.items) {
      if (this.items[index].appearTime===0) {
        continue;
      }
      var appearTime = this.items[index].appearTime;
      var disAppearTime = this.items[index].disAppearTime;
      var tt = disAppearTime - appearTime;

      if(tt > 1000 || tt<0) {
        //需要曝光的item
        var item = this.items[index];
        console.log(index);
        item.vos.forEach(function(value, i, array) {
          var sortId = index*2+i+1;

          var model = {
            analysisId: String(value.id),
            analysisType: 'deallist',
            analysisIndex: sortId,
            analysisSourceType: '2',
          };
          TBExposureManager.exposureItems(model, Math.floor(appearTime/1000), pageId, pageName);
        });

        this.items[index].appearTime = 0;
        this.items[index].disAppearTime = 0;
      }
    //   this.items[index].appearTime = 0;
    //   this.items[index].disAppearTime = 0;

    }
  };
};

module.exports = BZMUDealListModel;
