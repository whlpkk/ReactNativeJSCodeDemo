/*
 * @providesModule BZMDPriceInfo
 * @flow
 */
'use strict';
var React = require('react-native');
var BZMDCostEffective =  require('BZMDCostEffective');
var TBFacade = require('TBFacade');
var BZMCoreUtils = require('BZMCoreUtils');

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} = React;

var Dimensions = require('Dimensions');
var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;
var titleWidth = screenWidth -10;

var baoyouView = <View />;
var cheapView = <View />;
var cheapAmount = 0;

var PropTypes = React.PropTypes;
var BZMDPriceInfo = React.createClass({
  propTypes: {
    onPressedButton: PropTypes.func
  },
  renderLoadingView: function () {

      return (
          <View />
      );
  },
  renderBottomView: function(deal){
    var scoreText = null;
    var exchangeruleJsonData = null
    if (this.props.prodRuleData) {
      exchangeruleJsonData = BZMCoreUtils.jsonParse(this.props.prodRuleData["/h5/api/getexchangerule"]);
    }
    if (exchangeruleJsonData ==null||exchangeruleJsonData.result.code == -1) {
        scoreText =null;
    }else {
      if (deal.dealrecord!=null && deal.dealrecord.cheapAmountType!=null &&
          deal.dealrecord.cheapAmount!=null && deal.dealrecord.cheapAmountType == 2){
            scoreText =null;
          }else {
            scoreText = <Text style={styles.bottomLabel}>
            积分抵现{exchangeruleJsonData.exchangeRule.percent*100}%</Text>
          }
    }
    var salesCountText = null;

    if (this.props.salesCount == undefined ||this.props.salesCount == null || this.props.salesCount == 0) {
        salesCountText = <Text style={styles.bottomLabel}>新品上线</Text>
    }else {
      salesCountText = <Text style={styles.bottomLabel}>已售{this.props.salesCount}件</Text>
    }

    //-=-=-=-=-=-=deal.prod.product.sendAddress 这里不知道是不是服务器的问题
    var sendAddress = deal.prod.product.sendAddress;
    if (sendAddress) {
        if (sendAddress.startsWith("北京") ||
            sendAddress.startsWith("天津") ||
            sendAddress.startsWith("上海") ||
            sendAddress.startsWith("重庆") ) {
            sendAddress = sendAddress.substr(2);
        }
    }

    return(
      <View style={styles.bottom}>
      {scoreText}
      {salesCountText}
      <Text style={styles.bottomLabel}>{sendAddress}</Text>
      </View>
    );
  },
    renderEasyCheckDeal:function(deal,sku){

      var priceSection = '';
      if (this.props.price && this.props.price != '') {
          priceSection = '¥' + this.props.price;
      }else {
          priceSection = '¥' + (sku.curPrice-parseFloat(cheapAmount)*100)/100;
      }
      return(
        <View style={[easyCheckStyles.container,easyCheckStyles.sbu_borderBottom]}>

        <View style={easyCheckStyles.titleView}>
          <Text style={easyCheckStyles.titleLabel}
            numberOfLines={2}>
            <Text style={[easyCheckStyles.titleLabel,easyCheckStyles.redColor]}>[商家自荐]
            </Text>{deal.deal.short_title}</Text>
        </View>

        <View style={easyCheckStyles.easyCheckTitleView}>
          <Text style={[easyCheckStyles.easyCheckTextStyle,easyCheckStyles.redColor]}>
          本商品由商家自主发布
          </Text>
        </View>

          <View style={easyCheckStyles.priceView}>
            <Text style={easyCheckStyles.priceLabel}>{priceSection}</Text>
            {baoyouView}
            {cheapView}
          </View>

          <View style={easyCheckStyles.oriPriceView}>
            <Text style={easyCheckStyles.oriPriceStyle}>价格
              <Text style={easyCheckStyles.deleteLine}>
                ¥{sku.orgPrice/100}
              </Text>
            </Text>
          </View>
        <View style={easyCheckStyles.bottomView}>
        {this.renderBottomView(deal)}
        </View>
      </View>
      );
    },
    onPressedButton:function(){
      this.props.onPressedButton && this.props.onPressedButton();
    },
    renderFlagView: function(text){
      return(
        <View style={styles.flagView}>
          <Text style={styles.flagTextStyle}>
                  {text}
          </Text>
        </View>
      );
    },

    renderCheapView: function(datas){
      baoyouView = this.renderFlagView('包邮');
      cheapView = <View />
      // datas.dealrecord.cheapAmountType = 2;
      // datas.dealrecord.cheapAmount = '5';
      if (datas.dealrecord!=null && datas.dealrecord.cheapAmountType!=null &&
          datas.dealrecord.cheapAmount!=null) {
        switch (datas.dealrecord.cheapAmountType) {
          case 2: cheapView = this.renderFlagView('限时抢');//限时抢
                  cheapAmount = datas.dealrecord.cheapAmount;
            break;
          case 3: cheapView = this.renderFlagView('立减'+ datas.dealrecord.cheapAmount +'元');//拍下立减
            break;
          default:
            cheapView = <View />
        }
      }
    },
    renderDeal:function(deal,sku,titleWidth,costEffectiveModel){
      var priceSection = '';
      if (this.props.price && this.props.price != '') {
          priceSection = '¥' + this.props.price;
      }else {
          priceSection = '¥' + (sku.curPrice-parseFloat(cheapAmount)*100)/100;
      }
      return(
        <View style={[styles.container,styles.sbu_borderBottom]}>

          <View style={[styles.titleView,{width:titleWidth}]}>
            <Text style={[styles.titleLabel,{width:titleWidth}]}
              numberOfLines={2}>{deal.deal.short_title}</Text>
          </View>

          <View style={[styles.priceView,{width:titleWidth}]}>
            <Text style={styles.priceLabel}>{priceSection}</Text>
            {baoyouView}
            {cheapView}
          </View>

          <View style={[styles.oriPriceView,{width:titleWidth}]}>
            <Text style={[styles.oriPriceStyle,{width:titleWidth}]}>价格
              <Text style={styles.deleteLine}>
                ¥{sku.orgPrice/100}
              </Text>
            </Text>
          </View>

          <View style={styles.bottomView}>
            {this.renderBottomView(deal)}
          </View>

          <BZMDCostEffective datas={this.props.datas}
                             onPressedButton={this.onPressedButton}
                             costEffectiveModel={costEffectiveModel}/>
      </View>
      );
    },
    render: function(){
      var deal = this.props.datas;
      var sku = {"curPrice":0,"orgPrice":0};
      if (this.props.datas.prod.sku && this.props.datas.prod.sku.length>0) {
        sku = this.props.datas.prod.sku[0];
      }

      // this.fetchSwitchData(this.props.datas);
      var costEffectiveModel = this.props.costEffectiveModel;
      if (costEffectiveModel) {
        if (costEffectiveModel.showScoreSwitch && costEffectiveModel.showCommentEntrySwitch
            &&costEffectiveModel.ppDegreeContent!='' && costEffectiveModel.ppDegree >=2
            && costEffectiveModel.score>0) {
              //97 是 BZMDCostEffective组件的宽度
            titleWidth = screenWidth - 97 -10;
        }else if (!costEffectiveModel.showScoreSwitch && costEffectiveModel.showCommentEntrySwitch) {
            titleWidth = screenWidth - 97 -10;
        }else if (costEffectiveModel.showScoreSwitch && !costEffectiveModel.showCommentEntrySwitch) {
            titleWidth = screenWidth - 97 -10;
        }else if (!costEffectiveModel.showScoreSwitch && !costEffectiveModel.showCommentEntrySwitch){
            titleWidth = screenWidth - 10;
        }
      }


      this.renderCheapView(deal);

      if(deal.dealrecord.isLightAudit !=null && deal.dealrecord.isLightAudit == 1){
        //轻审核
        return this.renderEasyCheckDeal(deal,sku);
      }else {
        return this.renderDeal(deal,sku,titleWidth,costEffectiveModel);
      }
    }
});




var styles = StyleSheet.create({
    container: {
        height:109,
        backgroundColor:'white',
        justifyContent:'space-around'
    },
    titleView:{
      marginLeft:10,
      justifyContent:'center'
    },
    titleLabel:{
      fontSize:15,
      color:'#27272F',
      marginTop:5
    },
    priceView:{
      marginLeft:10,
      flexDirection:'row',
      alignItems:'center',
    },
    oriPriceView:{
      marginLeft:10,
    },
    flagView:{
      height:14,
      marginLeft:7,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#EF4949'
    },
    flagTextStyle:{
      marginLeft:3,
      marginRight:3,
      color:'#FFFFFF',
      fontSize:9,
      textAlign:'center'
    },
    rmbIcon:{
      marginTop:14,
      width:16,
      height:19
    },
    priceLabel:{
      fontSize:22,
      color:'#EF4949'
    },
    oriPriceStyle:{
      fontSize:11,
      color:'#9D9D9D'
    },
    deleteLine:{
      textDecorationLine: 'line-through',
    },
    bottomView:{
      marginLeft:10,
      marginRight:10
    },
    bottom:{
      flex:1,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
    },
    bottomLabel:{
      color:'#A8A8A8',
      fontSize:11
    },

    sbu_borderBottom:{
      borderColor:'#d5d5d5',
      borderBottomWidth:0.5
    }
});

var easyCheckStyles = StyleSheet.create({
    container: {
        height:109,
        backgroundColor:'white',
        justifyContent:'space-around'
    },
    titleView:{
      marginLeft:10,
      justifyContent:'center',
    },
    titleLabel:{
      fontSize:15,
      color:'#27272F',
    },
    easyCheckTitleView:{
      marginLeft:10,
      justifyContent:'center'
    },
    easyCheckTextStyle:{
      fontSize:12
    },
    redColor:{
      color:'#ef4949'
    },
    priceView:{
      marginLeft:10,
      marginRight:10,
      flexDirection:'row',
      alignItems:'center',
    },
    oriPriceView:{
      marginLeft:10,
      justifyContent:'center',
    },
    rmbIcon:{
      marginTop:14,
      width:16,
      height:19
    },
    priceLabel:{
      fontSize:22,
      color:'#EF4949',
    },
    oriPriceStyle:{
      fontSize:11,
      color:'#9D9D9D'
    },
    deleteLine:{
      textDecorationLine: 'line-through',
    },
    bottomView:{
      marginLeft:10,
      marginRight:10,
      justifyContent:'center',
    },
    sbu_borderBottom:{
      borderColor:'#d5d5d5',
      borderBottomWidth:0.5
    }
});
module.exports = BZMDPriceInfo;
