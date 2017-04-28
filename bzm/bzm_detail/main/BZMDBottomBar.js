/*
 * @providesModule BZMDBottomBar
 * @flow
 */
'use strict';
var React = require('react-native');
var TimerMixin = require('react-timer-mixin');

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    NativeAppEventEmitter,
} = React;

var TBImage = require('../../bzm_core/components/TBImage');
var BZMCoreUtils = require('../../bzm_core/utils/BZMCoreUtils');
var TBFacade = require('TBFacade');
var TBIMManager = require('TBIMManager');
var BZMDMobileLog = require('BZMDMobileLog');
var TBSellingReminderManager = require('TBSellingReminderManager');
var TBTip = require('TBTip');


var SHOP_API_URL = 'http://th5.m.zhe800.com/h5/shopindex?'
var IM_API_URL =  'http://th5.m.zhe800.com/h5/api/getcommonconfig?key=tao800.im.seller.switch&position=0'
var CART_API_URL = 'http://th5.m.zhe800.com/h5/cart/list/my'
var REQUEST_CART_URL = 'http://th5.m.zhe800.com/h5/api/cart/count';

var im = {};


var DealState = {
  alreadySellFinish: 0, //已抢光
  alreadyUnShelve: 1,   //已下架
  yetNotSell: 2,        //未开卖
  normal: 3,            //正常
  immediatelyBuy: 4,    //立即购买
};

var PropTypes = React.PropTypes;
var BZMDBottomBar = React.createClass({

  propTypes: {
    //商品类型 DealState
    type: PropTypes.number,

    //是否有店铺优惠
    hasShopRateInfo: PropTypes.bool,

    //店铺数据
    data: PropTypes.object.isRequired,

    //开卖时间，如果是未开卖状态下显示，格式 "2016-01-27 10:25:05"
    beginTime: PropTypes.string,

    //现在时间，格式 "2016-01-27 10:25:05"
    nowTime: PropTypes.string,

    //锁定库存，如果是已抢光状态下显示
    stock: PropTypes.number,

    //点击添加购物车回调
    onAddCartPress: PropTypes.func,

    //点击立即购买回调
    onImmediatelyBuyPress: PropTypes.func,
  },

  mixins: [TimerMixin],

  getInitialState: function() {
    return {
      time: {
        hours: 0,
        minutes: 0,
        seconds: 0,
        millisecond: 0,
      },
      cartNumber: 0,
      imStatus: 0,

      sellingReminderStatus: false,
    };
  },

  getDefaultProps: function() {
    return {
      type: DealState.normal,
      hasShopRateInfo: false,
      stock: 0,
    };
  },

  componentWillMount: function() {
    if (this.props.type === DealState.yetNotSell && !this.props.beginTime) {
      console.error('当type为未开卖时，beginTime必传');
    }
    if (this.props.type === DealState.yetNotSell && this.props.beginTime.length>0) {
      this.tt = this._getDiffTime();
      this.timer = this.setInterval(this._getRTime,100);

      //获取开卖提醒状态
      TBSellingReminderManager.getSellingReminderState(dealVo.id, (contain)=>{
          if (contain !== this.state.sellingReminderStatus) {
              this.setState({
                  sellingReminderStatus: contain,
              });
          }
      });
    }

    this.fetchIMStatus();
    this.fetchIMData();
    this.loadCartCount();
  },
  // componentDidMount: function() {
  //   this.subscription = NativeAppEventEmitter.addListener(
  //     'cartNumberChange',
  //     (cartDict)=>{
  //       console.log(cartDict);
  //       this.setState({'cartNumber':cartDict.cartNumber});
  //     }
  //   )
  // },
  // componentWillUnmount: function() {
  //   this.subscription.remove();
  // },

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.fetchIMStatus();
      this.fetchIMData();
    }
    if (this.props.type === DealState.yetNotSell && this.props.beginTime!== nextProps.beginTime) {
      if (this.timer) {
        this.clearInterval(this.timer);
        this.tt = this._getDiffTime();
        this.timer = this.setInterval(this._getRTime,100);
      }
    }
  },

  loadCartCount: function() {
    fetch(REQUEST_CART_URL)
      .then((response) => {
        if (!response.ok) {
          return;
        }
        return response.json();
      })
      .then((responseData) => {
        if (!responseData) {
          return;
        }
        if (responseData.result.code == 0) {
          var carNumber = responseData.value;
          this.setState({'cartNumber':carNumber});
        }
        return;
      })
      .catch((error) => {
        //网络错误
      })
      .done();
  },

  _onAddCartPress: function() {
    this.props.onAddCartPress && this.props.onAddCartPress();
  },
  _onImmediatelyBuyPress: function() {
    this.props.onImmediatelyBuyPress && this.props.onImmediatelyBuyPress();
  },
  _onRemindPress: function() {

    if (this.props.data && this.props.data.deal.id) {
        var dealId = this.props.data.deal.id;
        if(this.state.sellingReminderStatus) {
            //已设置开卖提醒
            TBSellingReminderManager.cancelStartSellingReminder(dealId, this.props.beginTime, (result)=>{
                if (result === TBSellingReminderManager.Successfully) {
                    this.setState({
                        sellingReminderStatus: false,
                    });
                    TBTip.show('取消提醒成功');
                }else {
                    TBTip.show('取消提醒失败');
                }
            });
        }else {
            //未设置开卖提醒
            TBSellingReminderManager.settingStartSellingReminder(dealId, this.props.beginTime, (result)=>{
                // console.log(result);
                if (result === TBSellingReminderManager.Successfully) {
                    this.setState({
                        sellingReminderStatus: true,
                    });
                    TBTip.show('设置成功，开卖前5分钟提醒您');

                    //页面流转打点
                    var modelVo = {
                        "analysisId": String(dealId),
                        "analysisType": 'remind',
                        "analysisIndex": 1,
                    };
                    BZMDMobileLog.pushLogForPageName(dealId,modelVo);

                }else if (result === TBSellingReminderManager.Failed){
                    TBTip.show('设置失败');
                }else if (result === TBSellingReminderManager.AllReadySet) {
                    TBTip.show('已经设置成功');
                }
            });
        }
    }
  },

  _onIMPress: function() {
    var dealid = this.props.data.deal.id;
    var dom_json = {'dealid':dealid};

    if (im.sellerInfo && Object.keys(im.sellerInfo).length > 4) {
      var sellerInfo = im.sellerInfo;
      dom_json.preSaleIM = sellerInfo.preSaleIM; //售前IM
      dom_json.afterSaleIM = sellerInfo.afterSaleIM; //售后IM
      dom_json.preSaleIMs = sellerInfo.preSaleIMs; //售前IMs
      dom_json.afterSaleIMs = sellerInfo.afterSaleIMs; //售后IMs
      dom_json.accountIM = sellerInfo.accountIM; //售后主IM
      dom_json.company = sellerInfo.nickName; //店铺名称

      if (im.sellerSwitch == "1") {
          //success
          if (dom_json.preSaleIMs.length > 1) {
              dom_json.preSaleIMsAdd = dom_json.accountIM + "," + dom_json.preSaleIMs;
          } else {
              dom_json.preSaleIMsAdd = dom_json.accountIM;
          }

          if (dom_json.afterSaleIMs.length > 1) {
              dom_json.afterSaleIMsAdd = dom_json.accountIM + "," + dom_json.afterSaleIMs;
          } else {
              dom_json.afterSaleIMsAdd = dom_json.accountIM;
          }
          this._openIM(dom_json);
      } else {
          //失败
          this._openQQ(dom_json);
      }

      //页面流转打点
      if (this.props.data && this.props.data.deal.id) {
          var dealId = this.props.data.deal.id;
          var modelVo = {
              "analysisId": "seller",
              "analysisType": 'im',
              "analysisIndex": 1,
          };
          BZMDMobileLog.pushLogForPageName(dealId,modelVo);
      }
    };
  },
  _openIM: function(dom_json) {
    var data = this.props.data;

    var imgs = data.prod.product.imgKey.split(",");
    var imgUrls = imgs.map(function(el) {
      var thumbnail_arr = el.split(".");
      if (thumbnail_arr.length>1) {
        thumbnail_arr.splice(-1,0,'400x');
      }
      var thumbnailUrl = thumbnail_arr.join('.');
      return "http://z11.tuanimg.com/imagev2/trade/"+thumbnailUrl;
    });

    var wap_url = "http://out.zhe800.com/jump?jump_source=2"+"&id="+data.deal.id;
    var parameters = {
      "type": "deal",
      "j_info": {
        "busUid": dom_json.preSaleIM,
        "jids": dom_json.preSaleIMsAdd,
        "jid": dom_json.accountIM,
        "name": dom_json.company,
      },
      "data": {
        "id": data.deal.id,
        "list_price": data.prod.sku[0].orgPrice/100,
        "price": data.prod.sku[0].curPrice/100,
        "wap_url": wap_url,
        "image_url": {
          "normal": imgUrls,
        },
        "zid": data.prod.product.id,
        "name": data.prod.product.name,
      }
    }

    TBIMManager.openIMWithParameters(parameters);
  },
  _openQQ: function(dom_json) {
    TBFacade.nativeInfo(function() {
      var cView = this.refs["containerView"];
      var cTag = React.findNodeHandle(cView);
      var main_url = "http://im.zhe800.com/h5/index.html";
      var url = main_url + "?busUid=" + dom_json.preSaleIM + "&shopname=" + encodeURIComponent(dom_json.company) + "&dealid=" + dom_json.dealid + '&title=' + 'h5_IM';
      TBFacade.forward(cTag, url);
    }.bind(this));
  },

  _onShopDetailPress: function() {
    var url = SHOP_API_URL + 'id=' + this.props.data.deal.id
              + '&pub_page_from=zheclient&p_refer='+this.props.data.deal.id;
    var cView = this.refs["containerView"];
    var cTag = React.findNodeHandle(cView);
    TBFacade.forward(cTag, url);

    if (this.props.data && this.props.data.deal.id) {
        var dealId = this.props.data.deal.id;
        var modelVo = {
            "analysisId": "bottom",
            "analysisType": 'sellershop',
            "analysisIndex": 4,
        };
        BZMDMobileLog.pushLogForPageName(dealId,modelVo);
    }
  },
  _onToCartPress: function() {
    var url = CART_API_URL;
    var cView = this.refs["containerView"];
    var cTag = React.findNodeHandle(cView);
    TBFacade.forward(cTag, url);

    //页面流转打点
    if (this.props.data && this.props.data.deal.id) {
        var dealId = this.props.data.deal.id;
        var modelVo = {
            analysisId: "",
            analysisType: 'shopcart',
            analysisIndex: 1,
        };
        BZMDMobileLog.pushLogForPageName(dealId,modelVo);
    }
  },

  render: function(){

    if (this.props.hasShopRateInfo) {
      var shopView = <TBImage style={styles.shopView}
        urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_shopinfo_preferential.png")}/>
    }

    switch (this.props.type) {
      case DealState.normal:
        var rightView = <View style={styles.rightContainer}>
          <TouchableHighlight
            style={{flex:1}}
            onPress={this._onAddCartPress}>
            <View style={styles.shoppingCartContainer}>
                <Text style={styles.shoppingCartText}>加入购物车</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={{flex:1}}
            onPress={this._onImmediatelyBuyPress}>
            <View style={styles.buyContainer}>
              <Text style={styles.shoppingCartText}>立即购买</Text>
            </View>
          </TouchableHighlight>
        </View>
        break;
      case DealState.immediatelyBuy:
        var rightView = <View style={styles.rightContainer}>
          <TouchableHighlight
            style={{flex:1}}
            onPress={this._onImmediatelyBuyPress}>
            <View style={styles.buyContainer}>
              <Text style={styles.shoppingCartText}>立即购买</Text>
            </View>
          </TouchableHighlight>
        </View>
        break;
      case DealState.alreadyUnShelve:
        var rightView = <View style={styles.rightContainer}>
          <View style={styles.disableContainer}>
            <Text style={styles.shoppingCartText}>商品已下架</Text>
          </View>
        </View>
        break;
      case DealState.alreadySellFinish:
        var rightView = <View style={styles.rightContainer}>
          <View style={styles.disableContainer}>
            <Text style={styles.shoppingCartText}>商品已抢光</Text>
          </View>
        </View>
        break;
      case DealState.yetNotSell:
      {
          var time = this.state.time;
          var rightView = <View style={styles.rightContainer}>
            <View style={{flex:1}}>
              <Text style={styles.beginTimeText}>{this._getDayOrHourStr()}</Text>
              <View style={styles.timeView}>
                <Text style={styles.timeText}>{this._zerofill(time.hours,2)}</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.timeText}>{this._zerofill(time.minutes,2)}</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.timeText}>{this._zerofill(time.seconds,2)}</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.timeText}>{Math.floor(time.millisecond/100)}</Text>
              </View>
            </View>

            <TouchableHighlight
              style={{flex:1}}
              onPress={this._onRemindPress}>
              <View style={styles.buyContainer}>
                <Text style={styles.shoppingCartText}>{this.state.sellingReminderStatus?"开卖提醒我":"已设置提醒"}</Text>
              </View>
            </TouchableHighlight>
          </View>
      }
        break;
      default:
        var rightView = <View style={styles.rightContainer} />
        break;
    }

    if (this.state.cartNumber > 0) {
      var carNumberView = <View style={styles.cartNumber}>
        <Text style={styles.cart} numberOfLines={1} allowFontScaling={true}>{this.state.cartNumber}</Text>
      </View>
    }

    if (this.props.type === DealState.alreadySellFinish && this.props.stock > 0) {
      var stockView = <View style={styles.stockView}>
        <Text style={styles.stockText}>{'该商品有'+this.props.stock+'个尚未付款的订单，您还有机会～'}</Text>
      </View>
    }

    var IMIcon = (this.state.imStatus ==0 ? "bzm_detail/bzmd_bottombar_im_offLine.png" : "bzm_detail/bzmd_bottombar_im.png");

    return(
      <View>
        <View style={[styles.mainContainer,styles.sbu_borderTop]} ref='containerView'>
          {stockView}

          <TouchableHighlight onPress={this._onIMPress} >
            <View style={[styles.imStyle,styles.sbu_borderRight]}>
              <TBImage
                style={styles.imageStyle}
                urlPath={BZMCoreUtils.iconURL(IMIcon)}/>
              <Text style={styles.textStyle}>商家</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={this._onShopDetailPress} >
            <View style={[styles.imStyle,styles.sbu_borderRight]}>
              <TBImage style={styles.imageStyle}
                urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_bottombar_shop.png")}/>
              {shopView}
              <Text style={styles.textStyle}>店铺</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={this._onToCartPress} >
            <View style={[styles.imStyle,styles.sbu_borderRight]}>
              <TBImage style={styles.imageStyle}
                urlPath={BZMCoreUtils.iconURL("bzm_detail/bzmd_bottombar_shoppingCar.png")}/>
              {carNumberView}
              <Text style={styles.textStyle}>购物车</Text>
            </View>
          </TouchableHighlight>
          {rightView}
        </View>
      </View>
    );
  },

  fetchIMStatus: function() {
    var data = this.props.data;
    var sellerId = data.prod.product.sellerId;
    if (!sellerId) {
      return;
    }
    var url = 'http://im.zhe800.com/com.tuan800.im.userCenter/im/user/groupOnlineStatus.jsonp?idType=2&serveType=0&callback=jsonp2'+'&busUid='+sellerId;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          return;
        }
        return response.text()
      })
      .then((responseText) => {
        if (!responseText) {
          return;
        }
        if(responseText.length<9) {
          return;
        }
        var text = responseText.slice(7,-1);
        return JSON.parse(text)
      })
      .then((responseData) => {
        if (!responseData) {
          return;
        }
        if (responseData.responsecode=== '_200') {
          this.setState({
            imStatus: responseData.data,
          });
        }
      })
      .catch((error) => {
        //网络错误
      })
      .done();
  },

  fetchIMData: function() {
    var data = this.props.data;
    var sellerId = data.prod.product.sellerId;
    if (!sellerId) {
      return;
    }
    var url = IM_API_URL+'&sellerId='+sellerId;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          return;
        }
        return response.json()
      })
      .then((responseData) => {
        if (!responseData) {
          return;
        }
        responseData.forEach(function(el,index) {
          if (el.key == "sellerInfo") {
            im.sellerInfo = el.value;
          }
          //是否支持IM  1：支持，0：不支持
          if (el.key == "tao800.im.seller.switch") {
            im.sellerSwitch = el.value;
          }

        });
      })
      .catch((error) => {
        //网络错误
      })
      .done();
  },

  _getDiffTime: function() {
    // 把 "2016-01-27 10:25:05" 替换成 "2016/01/27 10:25:05"
    var beginTimeStr = this.props.beginTime.replace(/-/g,'/');
    var nowTimeStr = this.props.nowTime.replace(/-/g,'/');

    var beginTime = new Date(beginTimeStr);
    var nowTime = new Date(nowTimeStr);
    var t =beginTime.getTime() - nowTime.getTime();
    return t;
  },

  _getRTime: function() {
    this.tt -= 100;
    var t = this.tt;
    if (t <= 0) {
      this.clearInterval(this.timer);
      this.setState({
        time: {
          hours: 0,
          minutes: 0,
          seconds: 0,
          millisecond: 0,
        },
      });
      return;
    }

    var hours = Math.floor(t/1000/60/60);
    var minutes = Math.floor(t/1000/60%60);
    var seconds = Math.floor(t/1000%60);
    var millisecond = Math.floor(t%1000);

    this.setState({
      time: {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        millisecond: millisecond,
      },
    });
  },

  _getDayOrHourStr: function() :String {
    if (this.props.beginTime && this.props.beginTime.length> 0) {
      // 把 "2016-01-27 10:25:05" 替换成 "2016/01/27 10:25:05"
      var beginTimeStr = this.props.beginTime.replace(/-/g,'/');
      var nowTimeStr = this.props.nowTime.replace(/-/g,'/');

      var beginTime = new Date(beginTimeStr);
      var nowTime = new Date(nowTimeStr);
      var t =beginTime.getTime() - nowTime.getTime();
      if (t <= 0) {
        return '';
      }else {
        var beginDay = beginTime.getDate();
        var beginHour = beginTime.getHours();
        beginTime = this._getShortDate(beginTime);
        nowTime = this._getShortDate(nowTime);
        t =beginTime.getTime() - nowTime.getTime();
        var days = Math.floor(t/(1000*60*60*24));
        if(days == 0) {
          return '今天'+beginHour+'点开抢';
        }else if (days == 1) {
          return '明天'+beginHour+'点开抢';
        }else {
          return beginDay+'日'+beginHour+'点开抢';
        }
      }
    }
    return '';
  },

  _getShortDate: function(date1: Date) :Date {
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    date1.setMilliseconds(0);
    return date1;
  },

  _zerofill: function(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
  },

});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var totalRightWidth = (screenWidth - 3*55);

var styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    flexDirection:'row',
    height:51,
    backgroundColor:'#FFFFFF'
  },

  stockView: {
    position: 'absolute',
    height: 20,
    backgroundColor: '#666666',
    top: -20,
    left: 0,
    right: 0,
    opacity: 0.6,
    alignItems:'center',
    justifyContent:'center',
  },
  stockText: {
    fontSize: 13,
    color: 'white',
  },

  imStyle:{
    alignItems:'center',
    height:50,
    width:50,
    backgroundColor: 'white',
  },
  rightContainer:{
    flex: 1,
    flexDirection:'row',
  },

  shoppingCartContainer:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#FF9333',
    flex:1,
  },
  shoppingCartText:{
    fontSize:15,
    color:'#FFFFFF'
  },
  buyContainer:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#EF4949',
    flex:1,
  },
  disableContainer: {
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#B6B6B6',
    flex:1,
  },
  beginTimeText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  timeView: {
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    marginTop: 5,
  },
  timeText: {
    fontSize: 10,
    backgroundColor: 'black',
    color: 'white',
    width: 15,
    textAlign: 'center',
    paddingBottom: 1,
  },
  colon: {
    fontSize: 12,
    width: 5,
    textAlign: 'center',
    paddingBottom: 1,
  },

  imageStyle:{
    width:23,
    height:23,
    marginTop:6,
    backgroundColor:'transparent'
  },
  textStyle:{
    fontSize:10,
    color:'#3E4346',
    marginTop:5,
  },

  shopView: {
    position: 'absolute',
    backgroundColor: 'transparent',
    width: 17,
    height: 17,
    top: 3,
    right: 8,
  },
  cartNumber: {
    position: 'absolute',
    backgroundColor: '#f04949',
    borderRadius: 8,
    width: 16,
    height: 16,
    top: 3,
    right: 8,
    alignItems:'center',
    justifyContent:'center',
  },
  cart: {
    color: 'white',
    fontSize: 10,
    backgroundColor: 'transparent',
    marginBottom: 1,
  },

  sbu_borderTop:{
    // borderColor:'#d5d5d5',
    // borderTopWidth: 0.5,
  },
  sbu_borderRight:{
    borderColor:'#e5e5e5',
    borderRightWidth:0.5
  },

  textView:{
    flexDirection:'row',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:10
  }
});


module.exports = BZMDBottomBar;
