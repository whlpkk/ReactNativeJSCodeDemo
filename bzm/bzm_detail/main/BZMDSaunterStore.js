/*
 * @providesModule BZMDSaunterStore
 * @flow
 */
'use strict';
var React = require('react-native');
var BZMDShopRateInfo = require('BZMDShopRateInfo');
var TBFacade = require('TBFacade');
var BZMDMobileLog = require('BZMDMobileLog');

var {
    NavigatorIOS,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    AlertIOS,
    Image,
} = React;
var TBAlert = require('../../bzm_core/components/TBAlert');
var SHOP_API_URL = 'http://th5.m.zhe800.com/h5/shopindex?'

var BZMDSaunterStore = React.createClass({

  forwardToShopPage: function(){
    // var url = SHOP_API_URL + 'id=' + this.props.datas.product.promotionId
    //           + '&pub_page_from=zheclient&p_refer='+this.props.datas.product.promotionId;
    // console.log(url);
    //2969285 this.props.datas.product.promotionId todu
    var url = SHOP_API_URL + 'id=' + this.props.datas.deal.id
              + '&pub_page_from=zheclient&p_refer='+ this.props.datas.deal.id;
    console.log(url);

    var cView = this.refs["containerView"];
    var cTag = React.findNodeHandle(cView);
    TBFacade.forward(cTag, url);

    //页面流转打点
    if (this.props.datas && this.props.datas.deal.id) {
        var dealId = this.props.datas.deal.id;
        var modelVo = {
            "analysisId": "button",
            "analysisType": 'sellershop',
            "analysisIndex": 3,
        };
        BZMDMobileLog.pushLogForPageName(dealId,modelVo);
    }
  },
    render: function(){

      var shopRateDatas = this.props.shopRateDatas;
      var rateText='';
      if (shopRateDatas != null) {
        var rateInfo = new BZMDShopRateInfo(shopRateDatas,this.props.datas.dealrecord.cheapAmountType);
        rateText = rateInfo.text;
      }
      // rateText='满5元减1元，上不封顶';
      var containerHeight = 61;
      if (rateText != '') {
        var rateTextView = <Text style={styles.rateTextStyle}>{rateText}</Text>
        containerHeight = 81;
      }else {
        var rateTextView = null;
        containerHeight = 61;
      }

        return(

        <View style={[styles.container,styles.sbu_borderBottom,{height:containerHeight}]}
              ref="containerView">
          <TouchableHighlight style={styles.touchAreaView} onPress={() =>this.forwardToShopPage()}>
              <View style={styles.saunterStoreView}>
                <Text style={styles.saunterStoreText}>进店逛逛</Text>
              </View>
          </TouchableHighlight>
          {rateTextView}
        </View>
        );
    }
});
// <View style={styles.rateView}>
//     <Text>满16减1元＊满22元减2元</Text>
// </View>

var touchAreaViewWidth = 110;
var touchAreaViewHeight = 31;
var styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor:'white',
      alignItems: 'center',
      justifyContent:'center'
  },
  saunterStoreView:{
    width:touchAreaViewWidth,
    height:touchAreaViewHeight,
    borderColor:'#EF4949',
    borderWidth:1,
    borderRadius:3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white'
  },
  touchAreaView:{
    width:touchAreaViewWidth,
    height:touchAreaViewHeight,
  },
  saunterStoreText:{
    color:'#EF4949',
    fontSize:13
  },
  rateTextStyle:{

    fontSize:13,
    marginTop:10
  },
  rateView:{
    marginTop:14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateText:{
    color:'black',
    fontWeight:'bold',
    fontSize:15
  },
  sbu_borderBottom:{
    borderColor:'#d5d5d5',
    borderBottomWidth:0.5
  }
});


module.exports = BZMDSaunterStore;
