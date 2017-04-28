/*
 * @providesModule BZMDShopRate
 * @flow
 */
'use strict';
var React = require('react-native');
var TBImage = require('../../bzm_core/components/TBImage');
var BZMCoreUtils = require('../../bzm_core/utils/BZMCoreUtils');
var BZMDShopRateInfo = require('BZMDShopRateInfo');
var BZMDLimitDealCouponInfo = require('BZMDLimitDealCouponInfo');
var BZMDPlatformFullCutRateInfo = require('BZMDPlatformFullCutRateInfo');
var TBFacade = require('TBFacade');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMDMobileLog = require('BZMDMobileLog');

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} = React;
var SHOP_API_URL = 'http://th5.m.zhe800.com/h5/shopindex?'
var BZMDShopRate = React.createClass({
  //可获积分
  renderScoreView: function(){

    var userGradeKey = this.props.userGrade;
    userGradeKey = userGradeKey.toLowerCase();
    var datas = this.props.datas;
    var scoreText = '';

    if (datas && datas.deal && datas.deal.scores
        && datas.deal.scores[userGradeKey]) {
        if (datas.deal.scores[userGradeKey] > 200) {
          scoreText = '200积分';
        }else {
          scoreText = datas.deal.scores[userGradeKey] +'积分';
        }

    }else {
      return (<View />);
    }

      return(
          <View style={styles.touchAreaView}>
                <View style={[styles.subContainer,styles.sbu_borderBottom]}>
                  <View style={styles.rateView}>
                      <View style={styles.iconView}>
                        <Text style={styles.iconLabel}>送</Text>
                      </View>

                      <View style={styles.textStyle}>
                        <Text style={styles.rateLabel}>{scoreText}</Text>
                      </View>
                </View>

                </View>
          </View>

      );

  },
  //店铺优惠
  renderShopRateView: function(rateText){
    return(
      <TouchableHighlight onPress={() => this.forwardToShopPage()}>
        <View style={styles.touchAreaView}>
              <View style={[styles.subContainer,styles.sbu_borderBottom]}>
                <View style={styles.rateView}>
                    <View style={styles.iconView}>
                      <Text style={styles.iconLabel}>惠</Text>
                    </View>

                    <View style={styles.textStyle}>
                      <Text style={styles.rateLabel}>{rateText}</Text>
                    </View>
              </View>

              <TBImage style={styles.arrowsImage}
                       urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_arrows.png")}/>

              </View>
        </View>
      </TouchableHighlight>
    );
  },
  //平台满减优惠
  renderPlateRateView: function(platformFullCutRateStr,platformFullCutActivityId){
    return(
      <TouchableHighlight onPress={() => this.forwardToPlatformPage(platformFullCutActivityId)}>
        <View style={styles.touchAreaView}>
              <View style={[styles.subContainer,styles.sbu_borderBottom]}>
                <View style={styles.rateView}>
                    <View style={styles.iconView}>
                      <Text style={styles.iconLabel}>促</Text>
                    </View>

                    <View style={styles.textStyle}>
                      <Text style={styles.rateLabel}>{platformFullCutRateStr}</Text>
                    </View>
              </View>

              <TBImage style={styles.arrowsImage}
                       urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_arrows.png")}/>

              </View>
        </View>
      </TouchableHighlight>
    );
  },
  //限商品优惠券
  renderCouponView: function(limitDealCouponPrice,limitDealCouponActivityId){
    return(
      <TouchableHighlight onPress={() => this.forwardToCounponPage(limitDealCouponActivityId)}>
        <View style={styles.touchAreaView}>
              <View style={[styles.subContainer,styles.sbu_borderBottom]}>
                <View style={styles.rateView}>
                    <View style={styles.iconView}>
                      <Text style={styles.iconLabel}>券</Text>
                    </View>

                    <View style={styles.textStyle}>
                      <Text style={styles.rateLabel}>立减{limitDealCouponPrice}元,点此领券</Text>
                    </View>
              </View>

              <TBImage style={styles.arrowsImage}
                       urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_arrows.png")}/>

              </View>
        </View>
      </TouchableHighlight>
    );
  },
  forwardToCounponPage: function(limitDealCouponActivityId){
    var url = SHOP_API_URL + "/h5public/coupon?activityId=" + limitDealCouponActivityId + "&source_Type=2";
    var params = {
      "title": "限商品优惠券活动",
      "url": url
    };
    console.log(url);

    var cView = this.refs["containerView"];
    var cTag = React.findNodeHandle(cView);
    TBFacade.forward(cTag, url);

    //页面流转打点
    if (this.props.datas && this.props.datas.deal.id) {
        var dealId = this.props.datas.deal.id;
        var modelVo = {
            "analysisId": String(limitDealCouponActivityId),
            "analysisType": 'coupon',
            "analysisIndex": 1,
        };
        BZMDMobileLog.pushLogForPageName(dealId,modelVo);
    }
  },
  forwardToShopPage: function(){
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
            "analysisId": "discounta",
            "analysisType": 'sellershop',
            "analysisIndex": 1,
        };
        BZMDMobileLog.pushLogForPageName(dealId,modelVo);
    }
  },
  forwardToPlatformPage:function(activityId){
    var url = SHOP_API_URL + "/h5public/platformsale?activityId=" + activityId + "&pub_page_from=zheclient";
    var params = {
      "title": "平台满减活动列表页",
      "url": url
    };
    console.log(url);

    var cView = this.refs["containerView"];
    var cTag = React.findNodeHandle(cView);
    TBFacade.forward(cTag, url);
  },
  render :function(){
    var rateText = '';
    var limitDealCouponPrice = '';
    var limitDealCouponActivityId = '';

    var platformFullCutRateStr = '';
    var platformFullCutActivityId ='';

    var shopRateDatas = this.props.shopRateDatas;
    if (shopRateDatas != null) {
      var rateInfo = new BZMDShopRateInfo(shopRateDatas,this.props.datas.dealrecord.cheapAmountType);
      rateText = rateInfo.text;
    }
    var prodRuleData = this.props.prodRuleData;
    if (prodRuleData != null) {
      var limitDealCoupon = new BZMDLimitDealCouponInfo(BZMCoreUtils.jsonParse(prodRuleData["/h5/api/coupons/getactsforprod"]));
      limitDealCouponPrice = limitDealCoupon.price;
      limitDealCouponActivityId = limitDealCoupon.activityId;
    }

    var platformData = this.props.datas.deal;

    if (platformData) {
      var pInfo = new BZMDPlatformFullCutRateInfo(platformData);
      platformFullCutRateStr = pInfo.text;
      platformFullCutActivityId = pInfo.activityId;
    }

    var scoreView = this.renderScoreView();
    var shopRateView = <View />
    var palteRateView = <View />
    var couponView = <View />
    if (rateText!='') {
      shopRateView = this.renderShopRateView(rateText);
    }
    if (platformFullCutRateStr!='' && platformFullCutActivityId != '') {
      palteRateView = this.renderPlateRateView(platformFullCutRateStr,platformFullCutActivityId);
    }

    if (limitDealCouponPrice != '' && limitDealCouponActivityId !='') {
      couponView = this.renderCouponView(limitDealCouponPrice,limitDealCouponActivityId);
    }
    return(
      <View style={styles.container}
            ref="containerView">

        {scoreView}
        {shopRateView}
        {palteRateView}
        {couponView}
      </View>
    );
  }
});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var cellHeight = 43;

var styles = StyleSheet.create({
    container:{

    },
    subContainer:{
      height:cellHeight,
      flexDirection:'row',
      alignItems: 'center',
      marginLeft:10,
      marginRight:10,
      justifyContent:'space-between',
    },
    rateView:{
      flexDirection:'row',
    },
    iconView:{
      width:15,
      height:15,
      backgroundColor:'#e30c26',
      justifyContent:'center',
      alignItems: 'center',
      borderRadius:2
    },
    iconLabel:{
      fontSize:10,
      color:'white',
    },
    textStyle:{
      marginLeft:5,
    },
    rateLabel:{

      fontSize:12,
      color:'#545C66'
    },
    arrowsImage:{
      width:8,
      height:14,
      backgroundColor:'transparent'
    },
    touchAreaView:{
      height:cellHeight,
      width:screenWidth,
      backgroundColor:'#F6F6F6'
    },
    sbu_borderBottom:{
      borderColor:'#d5d5d5',
      borderBottomWidth:0.5
    }

});


module.exports = BZMDShopRate;
