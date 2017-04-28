/*
 * @providesModule BZMDRecommendDeal
 * @flow
 */
'use strict';
var React = require('react-native');
var TBFacade = require('TBFacade');
var {
    NavigatorIOS,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    AlertIOS,
} = React;
var TBAlert = require('../../bzm_core/components/TBAlert');
var TBImage = require('../../bzm_core/components/TBImage');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMDMobileLog = require('BZMDMobileLog');
var TBExposureManager = require('TBExposureManager')


var BZMDRecommendDeal = React.createClass({

  forward: function(zid,dealid,index){
    //添加页面流转打点
    if (this.props.datas && this.props.datas.deal.id) {
      var dealId = this.props.datas.deal.id;
      var modelVo = {
        "analysisId": String(dealId),
        "analysisType": 'deallist_shopcorrelation',
        "analysisIndex": index,
        "analysisSourceType": 2,
      };
      BZMDMobileLog.pushLogForPageName(dealId,modelVo);
    }

    //跳转
    var cView = this.refs["containerView"];
    var cTag = React.findNodeHandle(cView);
    var url = "zhe800://m.zhe800.com/mid/zdetail?zid="+zid+"&dealid="+dealid;
    TBFacade.forward(cTag, url);
  },

  //供外部组件调用
  checkExposureItems: function() {
    console.log("assa1234a");
    if (!this.props.recommendDealData) {
      return;
    }
    var recommendDealData = BZMCoreUtils.jsonParse(this.props.recommendDealData["/h5/api/getshopdealsfordetail"]);
    if (!recommendDealData || recommendDealData.response.docs==undefined ||
      recommendDealData.response.docs.length < 5  ) {
      return;
    }
    var dealArr = recommendDealData.response.docs;
    var dealId = this.props.datas.deal.id;
    var appearTime = new Date().getTime();
    for (var i = 0; i < 3; i++) {
      var deal = dealArr[i];
      var model = {
        analysisId: String(deal.id),
        analysisType: 'deallist_shopcorrelation',
        analysisIndex: i+1,
        analysisSourceType: '2',
      };
      TBExposureManager.exposureItems(model, Math.floor(appearTime/1000), BZMDMobileLog.pageId(dealId), BZMDMobileLog.pageName);
    }
  },

    render: function(){
      if (!this.props.recommendDealData) {
        return(
          <View />
        );
      }
      var recommendDealData = BZMCoreUtils.jsonParse(
        this.props.recommendDealData["/h5/api/getshopdealsfordetail"]);

      if (!recommendDealData || recommendDealData.response.docs==undefined ||
        recommendDealData.response.docs.length < 5  ) {
        return(
          <View />
        );
      }
      var dealArr = recommendDealData.response.docs;
        return(
          <View style={styles.container} ref="containerView">

            <View style={styles.subContainer}>
              <View style={styles.deal}>
                <TouchableHighlight onPress={() =>this.forward(dealArr[0].zid, dealArr[0].id, 0)}>
                <View style={styles.touchAreaView}>
                <TBImage style={styles.image}
                         urlPath={dealArr[0].image_hd5}
                         defaultPath={'bundle://lockImg_default@2x.png'}/>

                <View style={styles.textViewStyle}>
                  <Text style={styles.currentPriceStyle}>¥{dealArr[0].price/100}</Text>
                  <Text style={styles.oriPriceStyle}>{'  '}{dealArr[0].list_price/100}</Text>
                </View>

                </View>
                </TouchableHighlight>
              </View>

              <View style={styles.deal}>
                <TouchableHighlight onPress={() =>this.forward(dealArr[1].zid, dealArr[1].id, 1)}>
                <View style={styles.touchAreaView}>
                <TBImage style={styles.image}
                         urlPath={dealArr[1].image_hd5}
                         defaultPath={'bundle://lockImg_default@2x.png'}/>
                 <View style={styles.textViewStyle}>
                   <Text style={styles.currentPriceStyle}>¥{dealArr[1].price/100}</Text>
                   <Text style={styles.oriPriceStyle}>{'  '}{dealArr[1].list_price/100}</Text>
                 </View>
                </View>
                </TouchableHighlight>
              </View>

              <View style={styles.deal}>
                <TouchableHighlight onPress={() =>this.forward(dealArr[2].zid, dealArr[2].id, 2)}>
                <View style={styles.touchAreaView}>
                    <TBImage style={styles.image}
                             urlPath={dealArr[2].image_hd5}
                             defaultPath={'bundle://lockImg_default@2x.png'}/>
               <View style={styles.textViewStyle}>
                 <Text style={styles.currentPriceStyle}>¥{dealArr[2].price/100}</Text>
                 <Text style={styles.oriPriceStyle}>{'  '}{dealArr[2].list_price/100}</Text>
               </View>
                </View>
                </TouchableHighlight>
              </View>

            </View>
            <View style={styles.line} />
          </View>

        );
    }
});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var dealWidth = (screenWidth-40)/3;

var topMargin =13;
var containerHeight = 158*screenWidth/375;
var styles = StyleSheet.create({
  container: {
      height:containerHeight,
      backgroundColor:'white'
  },
  subContainer:{
    marginLeft:10,
    marginRight:10,
    height:containerHeight -0.5,
    flexDirection:'row',
    backgroundColor:'white',
    justifyContent:'space-between'
  },
  deal:{
    marginTop:topMargin,
  },
  touchAreaView:{
    backgroundColor:'white',
    height:containerHeight - topMargin -0.5,
  },
  textViewStyle:{
    marginTop:5,
    width:dealWidth,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  oriPriceStyle:{
    fontSize:10,
    color:'#666666',
    textDecorationLine: 'line-through'
  },
  currentPriceStyle:{
    fontSize:13,
    color:'#EF4949',
  },
  image: {
    height:dealWidth,
    width:dealWidth,
    backgroundColor:'#f6f6f6'
  },
  line:{
    height:0.5,
    width:screenWidth-20,
    marginLeft:10,
    marginRight:10,
    backgroundColor:'#d5d5d5'
  }
});


module.exports = BZMDRecommendDeal;
