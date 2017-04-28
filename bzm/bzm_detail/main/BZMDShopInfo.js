/*
 * @providesModule BZMDShopInfo
 * @flow
 */
'use strict';
var React = require('react-native');

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
var TBImage = require('../../bzm_core/components/TBImage');
var BZMCoreUtils = require('../../bzm_core/utils/BZMCoreUtils');
var TBFacade = require('TBFacade');
var BZMDMobileLog = require('BZMDMobileLog');

var SHOP_API_URL = 'http://th5.m.zhe800.com/h5/shopindex?'

var BZMDShopInfo = React.createClass({
  //shopRateDatas
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
            "analysisId": "shop",
            "analysisType": 'sellershop',
            "analysisIndex": 2,
        };
        BZMDMobileLog.pushLogForPageName(dealId,modelVo);
    }

  },
  getColorByType: function(type){
    switch (type) {
      case 1:
        return '#ef4949';
        break;
      case 0:
        return '#ff9333';
        break;
      case -1:
        return '#3eaa03';
        break;
      default:
        return '#A8A8A8';
    }
  },
  getScoreViewByType: function(type,colorValue){
    switch (type) {
      case 1:
        return <View style={{backgroundColor:colorValue,marginLeft:3}}>
                  <Text style={styles.scoreViewTextStyle}>高</Text>
                </View>;
        break;
      case 0:
        return <View style={{backgroundColor:colorValue,marginLeft:3}}>
                  <Text style={styles.scoreViewTextStyle}>平</Text>
                </View>;
        break;
      case -1:
        return <View style={{backgroundColor:colorValue,marginLeft:3}}>
                  <Text style={styles.scoreViewTextStyle}>低</Text>
                </View>;
        break;
      default:
        return <View />;
    }
  },
    render: function(){

    if (!this.props.hasShopRateInfo) {
        var shopRateIconImageView = <View />

    }else {
      var shopRateIconImageView = <View style={styles.shopRateIconView}>
          <TBImage style={styles.shopRateIconImageStyle}
                   urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_shopinfo_preferential.png")}/>
        </View>
    }
    var kingShop = null;
    var deal = this.props.datas.deal;
    if (deal && deal.proportion) {
      var kingShop =  <View style={styles.kingShopImageView}>
                        <TBImage style={styles.kingShopImage}
                                 urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_shopinfo_king.png")}/>
                      </View>
    }
    var sellerinfo = this.props.datas.sellerinfo;

    var text1 ='';
    var color1 = '#A8A8A8';
    var text2 ='';
    var color2 = '#A8A8A8';
    var text3 ='';
    var color3 = '#A8A8A8';
    var scoreView1 = <View />;
    var scoreView2 = <View />;
    var scoreView3 = <View />;

    var bottomView = <View />;
    var cHeight = 84;
    if (deal && deal.dsr) {
        var htmlstr = '<div class="dt_seller_dsr">';
        for (var i = 0; i < deal.dsr.length; i++) {
            var type = deal.dsr[i].type; /*type 类型，1：描述相符，2：服务态度，3：发货速度*/
            var value = parseFloat(deal.dsr[i].value).toFixed(1); /*value 分数值保留一位小数点*/
            var ratingType = deal.dsr[i].ratingType; /*  ratingType 与同行业平均值对比结果类型，1：高，0：相等，-1：低于*/
            if (type == 1) {
                text1 = value;
                color1 = this.getColorByType(ratingType);//ratingType
                scoreView1 = this.getScoreViewByType(ratingType,color1);
            }
            if (type == 2) {
                text2 = value;
                color2 = this.getColorByType(ratingType);
                scoreView2 = this.getScoreViewByType(ratingType,color2);
            }
            if (type == 3) {
              text3 = value;
              color3 = this.getColorByType(ratingType);
              scoreView3 = this.getScoreViewByType(ratingType,color3);
            }
        }

        bottomView =  <View style={styles.describeContainer}>
                          <View style={styles.describeSubView}>
                            <Text style={styles.describeText}>
                                {'描述相符：'}
                              <Text style={{color:color1}}>
                                {text1}
                              </Text>
                            </Text>
                            {scoreView1}
                          </View>
                          <View style={styles.describeSubView}>
                            <Text style={styles.describeText}>
                                {'服务态度：'}
                              <Text style={{color:color2}}>
                                {text2}
                              </Text>
                            </Text>
                            {scoreView2}
                          </View>
                          <View style={styles.describeSubView}>
                            <Text style={styles.describeText}>
                                {'发货速度：'}
                              <Text style={{color:color3}}>
                                {text3}
                              </Text>
                            </Text>
                            {scoreView3}
                          </View>
                      </View>;
    cHeight = 84;

    }else {
      bottomView = <View />
      cHeight = 42;
    }

    var shopName = sellerinfo.nick_name;
    if (shopName.length>15) {
      shopName = shopName.substring(0,15);
      shopName = shopName + '...';
    }

        return(
          <View ref="containerView">
          <TouchableHighlight onPress={() =>this.forwardToShopPage()}>
          <View style={[styles.container,{height:cHeight}]} >

              <View style={styles.shopView}>
                <View style={styles.imageView}>
                  <TBImage style={styles.image}
                           urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_shopinfo_icon.png")}/>
                </View>

                <View style={styles.shopNameView}>
                    <Text style={styles.shopNameText} numberOfLines={1}>{shopName}</Text>
                </View>

                {shopRateIconImageView}
                {kingShop}
              </View>

              {bottomView}
              <View style={styles.line} />
          </View>
          </TouchableHighlight>
          </View>
        );
    }
});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor:'white',
  },
  image:{
    width:25,
    height:25,
    backgroundColor:'transparent'
  },
  kingShopImage:{
    width:30,
    height:30,
    backgroundColor:'transparent'
  },
  imageView:{
    marginLeft:15,
    justifyContent:'flex-end'
  },

  kingShopImageView:{
    position:'absolute',
    right:10,
    bottom:0,
    justifyContent:'flex-end',

  },
  shopRateIconView:{
    width:17,
    height:17,
    marginTop:15,
    marginLeft:5
  },
  shopRateIconImageStyle:{
    width:17,
    height:17,
    backgroundColor:'transparent'
  },
  shopNameView:{
    // alignItems:'center',
    flexDirection:'row',
    marginRight: 10,
    marginLeft:10
  },
  shopNameText:{
    fontSize:14,
    color:'#27272F',
    marginTop:18
  },
  shopView:{
    flex:1,
    flexDirection:'row',
  },
  describeContainer:{
    flex:1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-between',
    marginLeft:10,
    marginRight:10
  },
  describeSubView:{
    flexDirection:'row',
    alignItems: 'center',
  },
  describeText:{
    color:'#A8A8A8',
    fontSize:12
  },
  scoreViewTextStyle:{
    color:'white',
    fontSize:11
  },
  margin:{
    marginLeft:10,
    marginRight:10
  },
  line:{
    width:screenWidth - 20,
    height:0.5,
    marginLeft:10,
    marginRight:10,
    backgroundColor:'#d5d5d5'
  },
});


module.exports = BZMDShopInfo;
