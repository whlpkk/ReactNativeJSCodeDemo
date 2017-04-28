/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
 /*
  * @providesModule BZMDMain
  * @flow
  */
'use strict';
var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
// 首页显示的本地组件
var BZMDImageSlider = require('./BZMDImageSlider');
var BZMDPriceInfo = require('./BZMDPriceInfo');
var BZMDShopRate = require('./BZMDShopRate');
var BZMDServerPromise = require('./BZMDServerPromise');
var BZMDInspector = require('./BZMDInspector');
var BZMDSelectColor = require('./BZMDSelectColor');
var BZMDBlank = require('./BZMDBlank');
var BZMDGoodRating = require('./BZMDGoodRating');
var BZMCoreModel = require('BZMCoreModel');
var BZMDShopInfo = require('./BZMDShopInfo');
var BZMDRecommendDeal = require('./BZMDRecommendDeal');
var BZMDSaunterStore = require('./BZMDSaunterStore');
var BZMDBottomBar = require('./BZMDBottomBar');
var BZMDScrollToLookMore = require('./BZMDScrollToLookMore');
var BZMDNavigationBar = require('./BZMDNavigationBar');
var BZMDTimerView = require('./BZMDTimerView');
var BZMDUDealCell = require('./BZMDUDealCell');
var BZMDBanner = require('./BZMDBanner');
var BZMDSKUView = require('../sku/BZMDSKUView');
var TBAnimation = require('TBAnimation');
var BZMDGradeView = require('BZMDGradeView');
var BZMDCheapAmountType = require('BZMDCheapAmountType');
var BZMDServerPromiseView = require('BZMDServerPromiseView');
var BZMDScrollToLookMoreTip = require('BZMDScrollToLookMoreTip');
//本地静态文件
var BZMDSKUModel = require('BZMDSKUModel');
var BZMDServerPromiseModel = require('BZMDServerPromiseModel');
var BZMDCostEffectiveService = require('BZMDCostEffectiveService');
//公用js代码
var TBExposureManager = require('TBExposureManager');
var TBLogin = require('TBLogin');
var TBTip = require('TBTip');
var TBImage = require('TBImage');
var TBFacade = require('TBFacade');
var TBLoading = require('TBLoading');
var TBPageError = require('TBPageError');
var BZMCoreUtils = require('BZMCoreUtils');
var BZMCoreStyle = require('BZMCoreStyle');
var BZMDMobileLog = require('BZMDMobileLog');

var {
    AsyncStorage,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    ListView,
    StatusBar
} = React;

var Dimensions = require('Dimensions');
var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;
var skuObjectSelect = null;
var skuModel = null;
var skuText='加载商品属性失败';
var costEffectiveModel = null;
var jkString = '';
var skuNum = '';
var didSentEndForContentLength = null;
//ze151229153638026978  ze150706153436000328
var API_URL_TEST = 'http://th5.m.zhe800.com/h5/api/proddetail?zid=ze160310170615256493';

var API_URL = 'http://th5.m.zhe800.com/h5/api/proddetail?';
var PROD_STATUS_API_URL = 'http://th5.m.zhe800.com/h5new/real/prodstatus?';

// http://192.168.10.144:8114/h5new/prodrule?id=2969285&device_id=11aa22&seller_id=778178&zid=ze150128160412000001&sourceType=2
var PROD_RULE_URL = 'http://th5.m.zhe800.com/h5new/cach/prodrule?';
var RECOMMENDDEAL_API_URL = 'http://th5.m.zhe800.com/h5new/cach/prodrecmd?'

var API_DOMAIN = 'http://th5.m.zhe800.com'
var API_COSTEFFECTIVE_URL = 'http://th5.m.zhe800.com/h5/api/addprodperformance';

var BZMDMain = React.createClass({

  mixins: [TimerMixin],

  getInitialState: function() {
    return {
      fetchDataError: undefined,
      datas: null,
      loaded: false,
      showPopupLoading: false,
      shopRateDatas: null,
      hasShopRateInfo:false,
      costEffectivePresentType:1,
      costEffectivePresentSore:0,

      salesCount:null,
      beginTime: null,
      endTime: null,
      nowTime:null,
      status: null,

      prodRuleData:null,
      recommendDealData:null,
      userGrade:'',
      lockTotal:0 //锁定库存
    };
  },

  componentDidMount: function() {
      BZMCoreModel.registerComponent['BZMDMain'] = (methodName, params) => {
         if (methodName == 'viewWillDisappear') {
              if (skuModel) {
                  skuModel.enableResponseKeyboard = false;
              }
          }else if (methodName == 'viewDidAppear') {
              this.fetchCartCount();
          }
      };
    this.fetchData();
  },
  fetchCartCount: function() {
    if (this.refs.BZMDBottomBar) {
      this.refs.BZMDBottomBar.loadCartCount();
    }
  },

  fetchData: function() {
    var contentView =  this.refs["containerView"];
    var cTag = React.findNodeHandle(contentView);
    TBLoading.pageLoading(cTag, {"x": 0,"y": 64,"width": screenWidth,"height": screenHeight-64});
    var url =API_URL + 'zid=' +this.props.zid;
    // var url = API_URL_TEST;//这是写死的url，动态查看就注释掉
    console.log(url);
    fetch(url)
      .then((response) => {
        if (cTag) {TBLoading.hidePageLoading(cTag, {});}
        if (!response.ok) {
          var status = response.status;
          var tipObject = BZMCoreUtils.tipType(status)
          this.setState({
            fetchDataError: tipObject,
          });
          return;
        }
        this.setState({
          fetchDataError: undefined,
        });
        return response.json()
      })
      .catch((error) => {
        // console.log(error);
        // 网络连接错误
        if (cTag) {TBLoading.hidePageLoading(cTag, {});}
        var tipObject = {
          errorMessage : "当前处于无网络状态，请检查设置",
          imageUrl : 'bundle://message_network_not_reachable@2x.png'};
        this.setState({
          fetchDataError: tipObject,
        });
      })
      .then((responseData) => {
        if (responseData!=null) {
          this.fetchCostEffectiveData(responseData);
          this.fetchRecommendDealData(responseData);
          this._loadJK(responseData.prod.productId);

          this.setState({
            datas: responseData,
            loaded: true,
          });
          this.fetchProdRuleData();

          this.fetchProdStatusData(responseData.prod.productId);
        }

      })
      .done();
  },
  fetchRecommendDealData: function(datas){
    var url = RECOMMENDDEAL_API_URL +'shop_id=' + datas.prod.product.sellerId
            + '&id=' + datas.deal.id + '&query_num=20';
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .catch((error) => {

      })
      .then((responseData) => {
        if (responseData!=null) {
          this.setState({
            recommendDealData:responseData
          });
        }
      })
      .done();
  },

  isEmptyObject:function (obj) {
   for (var key in obj) {
    return false;
   }
   return true;
 },
 containerViewResponderCapture(evt) {
     return this.props.tbNativeMoving;
 },

 fetchProdStatusData: function(zid) {
   //zid=ze150128160412000001
     var url = PROD_STATUS_API_URL + 'zid=' + zid;
     console.log(url);
     fetch(url)
       .then((response) => response.json())
       .catch((error) => {
         console.log('异常'+error);
       })
       .then((responseData) => {
         var beginTime =null;
         var endTime =null;
         var nowTime =null;
         var status = null;
         var salesCount = null;
         var stockDict = {};
         var lockTotalNum = 0;
         if (responseData!=null ) {

           var countdownData = BZMCoreUtils.jsonParse(responseData["/h5/api/countdown"]);
           if (countdownData!=null) {
              beginTime = countdownData.begin_time;
              endTime = countdownData.expire_time;
              nowTime = countdownData.now;
              status = countdownData.status;

              // console.log('beginTime'+beginTime);
              // console.log('endTime'+endTime);
              // console.log('nowTime'+nowTime);
              var type = this.state.datas.dealrecord.cheapAmountType;
              if (type == BZMDCheapAmountType.LIMIT ||
                  type == BZMDCheapAmountType.LIJIAN) {
                  status = 4;
              }
              var time = endTime.replace(/-/g,'/');
              var EndTime= new Date(time);

              var time2 = nowTime.replace(/-/g,'/');
              var NowTime = new Date(time2);

              var time3 = beginTime.replace(/-/g,'/');
              var BeginTime = new Date(time3);

              var t =EndTime.getTime() - NowTime.getTime();

              if (t < 0) {
                //结束时间小于当前时间 －－已结束
                status = 1;
              }
              if (BeginTime - NowTime > 0) {
                status = 2;//开始时间大于当前时间  －－未开卖
              }

           }
           var salecountData = BZMCoreUtils.jsonParse(responseData["/h5/api/salecount"]);
           if (salecountData!=null) {
             salesCount = salecountData.sales_volume;
           }

           var stockJSONData = BZMCoreUtils.jsonParse(responseData["/h5/api/skunew"]);
           if (stockJSONData!=null && stockJSONData.stockItems!=null
                &&stockJSONData.stockItems.length>0) {
             stockDict = stockJSONData;
           }
           if (stockJSONData!=null && stockJSONData.lockTotal!=null
              && stockJSONData.lockTotal!=undefined ) {
             lockTotalNum = stockJSONData.lockTotal;
           }
           this.wrapperSKU(this.state.datas,stockDict);

          //  beginTime = '2016-01-27 10:25:05';
          //  endTime = '2016-03-31 10:25:05';
          //  nowTime = '2016-03-31 8:25:05';

           this.setState({
             salesCount:salesCount,
             beginTime: beginTime,
             endTime: endTime,
             nowTime: nowTime,
             status: status,
             stockObject:stockDict,
             lockTotal:lockTotalNum
           });

         }
       })
       .done();
     },

  fetchProdRuleData: function(){

    TBFacade.nativeInfo(function(dm){
      var url = PROD_RULE_URL + 'id=' + this.state.datas.deal.id +
      '&device_id=' + dm.deviceId + '&seller_id=' + this.state.datas.prod.product.sellerId
      + '&zid=' +this.state.datas.prod.productId +'&sourceType=2';
      console.log(url);

      fetch(url)
        .then((response) => response.json())
        .catch((error) => {
        })
        .then((responseData) => {
          if (responseData!=null) {
            var discountJsonData = BZMCoreUtils.jsonParse(responseData["/h5/api/discount"]);
            if ( discountJsonData!= null) {
                if (discountJsonData.discountInfo !=null) {
                    if (!this.isEmptyObject(discountJsonData.discountInfo)) {
                      var type = this.state.datas.dealrecord.cheapAmountType;
                      var hasRateInfo = false;
                      if (type!= null && type!=2 && type !=3) {
                        hasRateInfo = true;
                      }else {
                        hasRateInfo = false;
                      }
                        this.setState({
                          shopRateDatas: discountJsonData,
                          hasShopRateInfo: hasRateInfo,
                          prodRuleData:responseData,
                          userGrade:dm.userGrade
                        });
                    }else {
                      this.setState({
                        shopRateDatas: null,
                        hasShopRateInfo: false,
                        prodRuleData:responseData,
                        userGrade:dm.userGrade
                      });
                    }
                }else {
                  this.setState({
                    shopRateDatas: null,
                    hasShopRateInfo: false,
                    prodRuleData:responseData,
                    userGrade:dm.userGrade
                  });
                }
              }
            }else {
              this.setState({
                shopRateDatas: null,
                hasShopRateInfo: false,
                prodRuleData:null,
                userGrade:dm.userGrade
              });
            }
          })
        .done();
    }.bind(this));
  },

  fetchCostEffectiveData: function(responseData){
   var costEffectiveService = new BZMDCostEffectiveService(responseData);

   costEffectiveModel = costEffectiveService.model;
   costEffectiveService.setCompletionBlock = function(){
     costEffectiveModel = costEffectiveService.model;
     this.setState({
       costEffectivePresentType:costEffectiveModel.type,
       costEffectivePresentSore:parseInt(costEffectiveModel.value)
     });

   }.bind(this);

   costEffectiveService.loadItem();
  },

  _loadJK: function (zid) {
    var url = "http://out.zhe800.com/native/jump?jump_source=2&zid=" + zid;
    TBExposureManager.appendOutUrl(url, "", (urlString)=> {
        fetch(urlString).then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                return null;
            }
        }, (e) => {

        }).then((obj) => {
            jkString = BZMCoreUtils.trimRight(obj);
        });
    });
},

wrapperSKU: function(datas,stockObject){
  if (datas.prod!=null && datas.prod.sku!=null
      && datas.prod.sku.length>0 && stockObject
      && stockObject.stockItems &&stockObject.stockItems.length>0) {
        var prodDict = datas.prod;
        prodDict.dealrecord = datas.dealrecord;

        skuModel = new BZMDSKUModel(datas.prod.sku,stockObject,prodDict,jkString,'default','default');
        // skuModel.selectSKUWithID("1-1001:4-75B");
  }
},
  presentSKUView:function(data,type) {
      // console.log(skuModel);
      if (data == '加载商品属性失败') {
        this.fetchData();
      }else {

        switch (type) {
          case 1: //点击sku
            skuModel.bottomBtnType = 'default';
            skuModel.action = 'default';
            skuModel.convertSKU();
            break;
          case 2: //点击bottomBar添加购物车
          skuModel.bottomBtnType ='cart';
          skuModel.action = 'cart';
          skuModel.convertSKU();
            break;
          case 3: //点击bottomBar立即购买
          skuModel.bottomBtnType = 'sure';
          skuModel.action = 'buy';
          skuModel.convertSKU();
            break;
          default:

        }
        skuModel.selectSKUWithID(skuNum);
          skuModel.enableResponseKeyboard=true;
        this.setState(this.state);
        var pView = this.refs["skuView"];
        var cView = this.refs["containerView"];
        var reactTag = React.findNodeHandle(pView);
        var cTag = React.findNodeHandle(cView);
        TBAnimation.presentView(reactTag, cTag);
      }

  },
  presentCostEffectiveView:function(){

    var pView = this.refs["gradeView"];
    var cView = this.refs["containerView"];
    var reactTag = React.findNodeHandle(pView);
    var cTag = React.findNodeHandle(cView);
    TBAnimation.presentView(reactTag, cTag);

    //mobileLog打点
    TBExposureManager.paramsLogWithEventId("access",{eventvalue:this.state.costEffectivePresentSore});
  },
  presentServerPromiseView:function(){
    var pView = this.refs["serverPromiseView"];
    var cView = this.refs["containerView"];
    var reactTag = React.findNodeHandle(pView);
    var cTag = React.findNodeHandle(cView);
    TBAnimation.presentView(reactTag, cTag);
  },
  _onSelectSku(skuObject) {
      if (skuObject != null && skuObject.selectedItems) {
        if (skuObject.item) {
          skuObjectSelect = skuObject;
          skuNum = skuObject.item.propertyNum;
        }else if (skuObject.selectedItems && skuObject.selectedItems.length>0) {
          skuObjectSelect = null;
          skuNum = skuObject.selectedItems[0].item.id;
        }else {
          skuNum = '';
          skuObjectSelect = null;
        }
          this.setState(this.state);
      }
  },

    _onCart(obj) {
        //购物车添加完成后的回调
        this.fetchCartCount();//查询购物车数量

        //页面流转打点
        if (this.state.datas && this.state.datas.deal.id) {
            var dealId = this.state.datas.deal.id;
            var modelVo = {
                "analysisId": "toshopcart",
                "analysisType": 'buy',
                "analysisIndex": 2,
            };
            BZMDMobileLog.pushLogForPageName(dealId,modelVo,2);
        }
    },

  _onBuySku(modelIndex,skuObject,didDismiss=false) {
    //modelIndex:1说明是详情页点击立即购买  modelIndex:2说明是sku弹层点击立即购买

    // 如果是sku界面且没有dismiss，则先收回后再跳转订单页
    if (modelIndex === 2 && !didDismiss) {
        var pView = this.refs["skuView"];
        var reactTag = React.findNodeHandle(pView);
        TBAnimation.dismissView(reactTag,()=>{
            this._onBuySku(modelIndex,skuObject,true);
        });
        return;
    }

    //跳转订单页
    TBFacade.nativeInfo(function(dm) {
      var data = this.state.datas;
      var dealId = data.deal.id;
      var jk = jkString; //统计代码

      var v_version = dm.version;
      var deviceId = dm.deviceId; //用户设备id
      var isbindphone = Boolean(dm.phone); //是否绑定手机号
      var is_login = Boolean(dm.userid); //用户是否登陆

      var brandProtected = data.dealrecord.brandProtected; //品牌保护
      var cheapType = data.dealrecord.cheapAmountType || BZMDCheapAmountType.DEFAULT; //优惠类型 默认0：无；1：1元抢；2：限时抢 3:拍下立减
      var cheapAmount = parseFloat(data.dealrecord.cheapAmount) || 0; //优惠价格,单位元

      if (!skuObject) {
        var item = data.prod.sku[0];
      }else {
        var item = skuObject.item;
      }
      var cur_price = parseInt(item.curPrice)/100; //优惠前的价格
      var money = parseInt(item.curPrice)/100; //优惠后价格，

      if(cheapType == BZMDCheapAmountType.LIJIAN && brandProtected == 0){
        //如果是拍下立减，且不是品牌保护，那么不需要减优惠价格
      }else {
        //减去优惠价格
        money = money - cheapAmount;
      }

      if (skuModel && item.vPicture) {
        let IMG_BASE = skuModel.imageBaseUrl;
        var skuImgSrc = IMG_BASE+item.vPicture; //sku图片
      }else {
        var skuImgSrc = data.deal.imgList[0];
      }


      var totalCount = item.activeProductCount; //总的库存
      var maxBuyLimit = data.prod.product.maxBuyLimit; //最大购买量
      if (maxBuyLimit == 0) {
          maxBuyLimit = totalCount;
      }
      var buy_min = Math.min(parseInt(totalCount), parseInt(maxBuyLimit));

      var is_sku = Boolean(data.prod.sku && Object.keys(data.prod.sku).length>1)
      if (is_sku) {
        //拼有SKU商品信息
        //t1: 该sku库存  t2: 该sku最大可购买数量  t3: 购买数量  t4: 真正价格  t5: 原价
        var item_data_m = item.propertyNum; //商品的SKU信息：185-1007:184-1102
        var sku_kc = item.activeProductCount || 0; //库存
        var buy_num = parseInt(skuObject.skuSelCount); //购买数量
        var url_data = "jk=" + jk + "&t1=" + sku_kc + "&t2=" + buy_min + "&t3=" + buy_num + "&t4=" + money + "&t5=" + cur_price + "&item_data=" + encodeURIComponent(item_data_m) + "&deviceId=" + deviceId + "&isbindphone=" + isbindphone +"&sku_img_src=" + encodeURIComponent(skuImgSrc);

        if(skuObject.selectedItems) {
          skuObject.selectedItems.forEach(function(value,index) {
            var label = value.label;
            var name = value.item.name;
            var title = label +"："+ name;
            url_data += "&tit" +(index+1)+ "=" + encodeURIComponent(title);
          });
        }
      } else {
        var sku_kc = totalCount; //库存
        var buy_num = 1; //购买数量
        var url_data = "jk=" + jk + "&t1=" + sku_kc + "&t2=" + buy_min + "&t3=" + buy_num + "&t4=" + money + "&t5=" + cur_price + "&deviceId=" + deviceId + "&isbindphone=" + isbindphone +"&sku_img_src=" + encodeURIComponent(skuImgSrc);
      }

      if (cheapType == 2) {
          var url = API_DOMAIN + "/activity/xianshi/detail_order?id=" + dealId + "&" + url_data + "&version=" + v_version + "&is_xsq=" + cheapType + "&xsq_price=" + cheapAmount;
      } else {
          var url = API_DOMAIN + "/h5/dealorder?id=" + dealId + "&" + url_data + "&version=" + v_version + "&is_plj=" + cheapType + "&plj_price=" + cheapAmount;
      }

      if (is_login) {
        var cView = this.refs["containerView"];
        var cTag = React.findNodeHandle(cView);
        TBFacade.forward(cTag, url);

        //页面流转打点，bottomBar直接购买
        if (this.state.datas && this.state.datas.deal.id) {
            var dealId = this.state.datas.deal.id;
            var modelVo = {
                "analysisId": "tobuy",
                "analysisType": 'buy',
                "analysisIndex": 1,
            };
            BZMDMobileLog.pushLogForPageName(dealId,modelVo,modelIndex);
        }
      } else {
        //登陆
        TBLogin.login(
            (e)=> {
                this.setTimeout(this._onBuySku.bind(this,modelIndex,skuObject),800);
            }, (e)=> {
                TBTip.show('取消登录');
            }
        );
      }
    }.bind(this));
  },

  _onAddCartPress() {
    var data = this.state.datas;
    var is_sku = Boolean(data.prod.sku && Object.keys(data.prod.sku).length>1)
    if (is_sku) {
      this.presentSKUView(skuText,2);
    }else {
      this._addToCart();
    }
  },

  _onImmediatelyBuyPress() {
    var data = this.state.datas;
    var is_sku = Boolean(data.prod.sku && Object.keys(data.prod.sku).length>1)
    if (is_sku) {
      this.presentSKUView(skuText,3);
    }else {
      this._onBuySku(1,skuObjectSelect);
    }
  },

  _addToCart: function () {
      var prod = this.state.datas.prod;

      var productId = prod.product.id;
      var skuNum = "";
      var count = 1;
      var price = prod.sku[0].curPrice;

      var param = [];
      param.push("productId=" + productId);
      param.push("skuNum=" + skuNum);
      param.push("count=" + count);
      param.push("price=" + price);
      param.push("jk=" + jkString);
      var queryString = param.join("&");
      var urlString = BZMCoreUtils.REQUEST_BASE_URL + "/h5/api/cart/addcart?" + queryString;
      fetch(urlString).then((response) => {
          if (response.ok) {
              return response.json();
          } else if (response.status == 401) {
              TBLogin.login(
                  (e)=> {
                      this._addToCart();
                  }, (e)=> {
                      //显示某个默认页面
                      TBTip.show('取消登录');
                  }
              );
          } else {
              return null;
          }
      }, (e) => {
          TBTip.show("添加失败");
      }).then((obj) => {
          if (!obj) {
            return;
          }
          if (obj.hasOwnProperty('result') && obj.result.code == 0) {
              TBTip.show("添加成功");
              TBFacade.removeItem(BZMCoreUtils.CART_LAST_REFRESH_TEIME,()=>{});
              this._onCart(obj);
          } else {
              TBTip.show("添加失败");
          }
      }).catch((error) => {
        //网络错误
      });
  },

    _onPressClose() {
        var pView = this.refs["skuView"];
        var reactTag = React.findNodeHandle(pView);
        TBAnimation.dismissView(reactTag,()=>{});
    },
    _onPressCloseCostEffective() {
        var pView = this.refs["gradeView"];
        var reactTag = React.findNodeHandle(pView);
        TBAnimation.dismissView(reactTag,()=>{});
    },
    _onSelectScore(score){
        TBFacade.nativeInfo(function(dm){
          fetch(API_COSTEFFECTIVE_URL, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                productId: this.state.datas.prod.productId,
                deviceId: dm.deviceId,
                score:String(score)
              })
            })
            .then((response) => response.json())
            .catch((error) => {
              console.log('post失败'+error);
              // this.setState(this.state);
            })
            .then((responseData) => {
              console.log('post完成'+responseData);
              // if (responseData==null) {
              //   enableRender = true;
              //   // this.setState(this.state);
              //   return;
              // }

            })
            .done();

        }.bind(this));

        var pView = this.refs["gradeView"];
        var reactTag = React.findNodeHandle(pView);
        TBAnimation.dismissView(reactTag,()=>{});
    },

    _onPressCloseServerPromiseView() {
        var pView = this.refs["serverPromiseView"];
        var reactTag = React.findNodeHandle(pView);
        TBAnimation.dismissView(reactTag,()=>{});
    },

  _firstScrollViewEndDrag: function(e){
    var offset = e.nativeEvent.contentOffset.y;
    var contentSizeHeight = e.nativeEvent.contentSize.height;
    var distance = offset + (screenHeight - 51 - 64) - contentSizeHeight;
    if (distance > 60) {
      this.refs.BZMDScrollToLookMore.fetch();
      this.refs.outerScrollView.getScrollResponder().scrollTo({x:0,y:screenHeight-51,animated:true});
    }
  },
  _secondScrollViewEndDrag: function(e){
    var offset = e.nativeEvent.contentOffset.y;
    if (offset < -60) {
      this.scrollToOrigin();
    }
  },
  scrollToOrigin: function(){
    this.refs.outerScrollView.getScrollResponder().scrollTo({x:0,y:0,animated:true});
    //调用商家推荐商品控件曝光
    this.refs.BZMDRecommendDealView.checkExposureItems();
  },
  scrollToTop: function(){
    this.refs.outerScrollView.getScrollResponder().scrollTo({x:0,y:0,animated:true});
    this.refs.firstScrollView.getScrollResponder().scrollTo({x:0,y:0,animated:true});
  },
  _onScrollToLookDealDetail:function(){
    this.refs.BZMDScrollToLookMore.fetch();
    this.refs.outerScrollView.getScrollResponder().scrollTo({x:0,y:screenHeight-51,animated:true});
  },
  _tagTipPress: function() {
    this.fetchData();
  },
  _goBack: function() {
      var cView = this.refs["containerView"];
      var cTag = React.findNodeHandle(cView);
      TBFacade.goBack(cTag);
  },
  _getDistanceFromEnd: function(scrollProperties) {
    var maxLength = Math.max(
      scrollProperties.contentLength,
      scrollProperties.visibleLength
    );
    return maxLength - scrollProperties.visibleLength - scrollProperties.offset;
  },
  _firstScroll: function(e) {
    var scrollProperties = {};
    scrollProperties.visibleLength = e.nativeEvent.layoutMeasurement['height'];
    scrollProperties.contentLength = e.nativeEvent.contentSize['height'];
    scrollProperties.offset = e.nativeEvent.contentOffset['y'];

    if (this._getDistanceFromEnd(scrollProperties) >= 260) {
      // Scrolled out of the end zone, so it should be able to trigger again.
      didSentEndForContentLength = null;
    }else {
      if (scrollProperties.contentLength !== didSentEndForContentLength) {
        didSentEndForContentLength = scrollProperties.contentLength;
        //调用商家推荐商品控件曝光
        this.refs.BZMDRecommendDealView.checkExposureItems();
      }
    }
  },


  renderDeal: function(){

        var BZMDImageSliderView = <BZMDImageSlider
                      datas={this.state.datas}
                      onScrollToLookDealDetail={this._onScrollToLookDealDetail}/>

        var price = '';

        if (skuModel!=null && skuModel.bzmData!=undefined && skuModel.bzmData!=null
            && skuModel.bzmData.skuSelect!=undefined && skuModel.bzmData.skuSelect!='') {
            skuText = skuModel.bzmData.skuSelect;
            price = skuModel.bzmData.priceSection;
        }
        var BZMDSelectColorView = <View />
        if (this.state.datas.prod.sku!=null &&this.state.datas.prod.sku.length > 1) {
            BZMDSelectColorView = <BZMDSelectColor
                                          onPressSKU={(data)=> this.presentSKUView(data,1)}
                                          skuText={skuText}/>
        }


        var BZMDPriceInfoView = <BZMDPriceInfo
                                      datas={this.state.datas}
                                      onPressedButton={this.presentCostEffectiveView}
                                      salesCount={this.state.salesCount}
                                      costEffectiveModel={costEffectiveModel}
                                      prodRuleData = {this.state.prodRuleData}
                                      price = {price}/>

        var BZMDUDealCellView = <BZMDUDealCell datas={this.state.datas} />

        if (!this.state.nowTime ||!this.state.beginTime ||!this.state.endTime ) {
          var BZMDTimerViewView = null;
        }else {
          var BZMDTimerViewView = <BZMDTimerView nowTime={this.state.nowTime}
                                                 beginTime={this.state.beginTime}
                                                 endTime={this.state.endTime}/>
        }


        var BZMDShopRateView = <BZMDShopRate  shopRateDatas={this.state.shopRateDatas}
                                              prodRuleData={this.state.prodRuleData}
                                              datas = {this.state.datas}
                                              userGrade = {this.state.userGrade}/>
// BZMDServerPromiseView
        var BZMDServerPromiseView = <BZMDServerPromise onPressedButton={this.presentServerPromiseView}
                                                                 datas={this.state.datas}/>

        var BZMDBannerView = <BZMDBanner datas={this.state.datas}/>


        var BZMDInspectorView = <BZMDInspector datas={this.state.datas}
                                                         prodRuleData={this.state.prodRuleData}/>

        if(this.state.datas.dealrecord.isLightAudit !=null && this.state.datas.dealrecord.isLightAudit == 1){
            //轻审核 不显示验货师模块
            BZMDInspectorView = <View />
        }

        var BZMDBlankView = <BZMDBlank />


        var BZMDGoodRatingView = <BZMDGoodRating datas={this.state.datas}/>

        var BZMDShopInfoView = <BZMDShopInfo
                          hasShopRateInfo={this.state.hasShopRateInfo}
                          datas={this.state.datas}/>

        var BZMDRecommendDealView = <BZMDRecommendDeal datas={this.state.datas}
                                                        ref="BZMDRecommendDealView"
                                                        recommendDealData={this.state.recommendDealData}/>

        var BZMDSaunterStoreView = <BZMDSaunterStore  datas={this.state.datas}
                                                      shopRateDatas = {this.state.shopRateDatas}/>
    return(
      <View>
      {BZMDImageSliderView}
      {BZMDTimerViewView}
      {BZMDPriceInfoView}
      {BZMDUDealCellView}
      {BZMDServerPromiseView}
      {BZMDShopRateView}


      {BZMDBannerView}
      {BZMDSelectColorView}
      {BZMDBlankView}
      {BZMDInspectorView}

      {BZMDGoodRatingView}
      {BZMDShopInfoView}
      {BZMDRecommendDealView}
      {BZMDSaunterStoreView}
      <BZMDScrollToLookMoreTip />
      </View>
    );
  },

    render: function(){

      if (this.state.fetchDataError) {
        var view = <TBPageError
        style={{backgroundColor: '#ffffff',flex: 1,height:screenHeight-64}}
        title={this.state.fetchDataError.errorMessage}
        imagePath={this.state.fetchDataError.imageUrl}
        onTap={this._tagTipPress} />
      }else {
        if (!this.state.loaded) {
          var view = <View />
        }else {
          var serverPromiseModel = new BZMDServerPromiseModel(this.state.datas);
          var supportNum = serverPromiseModel.supportNumArray;
          var timeStr = serverPromiseModel.sendOutTimeStr;
          var skuPresentView = null;

          if (!skuModel) {
              skuPresentView = null;
          }else {
              skuPresentView =  <View style={BZMCoreStyle.skuContainer()} ref="skuView">
                                    <BZMDSKUView
                                        skuModel={skuModel}
                                        onPressClose={this._onPressClose}
                                        onBuy={this._onBuySku.bind(this,2)}
                                        onCart={this._onCart}
                                        onSelectItem={this._onSelectSku} />
                                </View>;
          }


          var view =
          <View>
            <ScrollView style={styles.scrollViewStyle}
            ref = 'outerScrollView'
            scrollEnabled={false}>

              <ScrollView
               onScrollEndDrag={this._firstScrollViewEndDrag}
               onScroll={this._firstScroll}
               scrollEventThrottle={200}
               ref = 'firstScrollView'
               style={styles.scrollViewStyle}>
                 {this.renderDeal()}
               </ScrollView>

              <BZMDScrollToLookMore
                  onScrollToOrigin={this.scrollToOrigin}
                  onScrollToTop={this.scrollToTop}
                  datas={this.state.datas}
                  recommendDealData = {this.state.recommendDealData}
                  ref={"BZMDScrollToLookMore"}
                  />

            </ScrollView>
            <BZMDBottomBar
              ref={"BZMDBottomBar"}
              hasShopRateInfo={this.state.hasShopRateInfo}
              data={this.state.datas}
              stock={this.state.lockTotal}
              onAddCartPress={this._onAddCartPress}
            //   onAddCartPress={this.presentSKUView.bind(this,skuText,2)}
              onImmediatelyBuyPress = {this._onImmediatelyBuyPress}
              type={this.state.status}
              beginTime ={this.state.beginTime}
              nowTime={this.state.nowTime} />

                {skuPresentView}

                <View style={styles.presentGradeView} ref="gradeView">
                  <BZMDGradeView
                    type={this.state.costEffectivePresentType}
                    score={this.state.costEffectivePresentSore}
                    onCancel={this._onPressCloseCostEffective}
                    onSelect={this._onSelectScore} />
                </View>

                <View style={styles.presentServerPromiseView} ref="serverPromiseView">
                  <BZMDServerPromiseView
                    typeArray={supportNum}
                    time={timeStr}
                    onClose={this._onPressCloseServerPromiseView} />
                </View>
            </View>
        }
      }
        return(
          <View style={styles.container}
          ref="containerView"
          onStartShouldSetResponderCapture={(evt)=>this.containerViewResponderCapture(evt)}
          onMoveShouldSetResponderCapture={(evt)=>this.containerViewResponderCapture(evt)}>
          <StatusBar barStyle="default"/>
          <BZMDNavigationBar title={'商品详情'}
                            onBack={this._goBack}
                            netWorkError={this.state.fetchDataError}
                            loading = {!this.state.loaded}
                            datas={this.state.datas}/>

            {view}
          </View>

        );
    }
});
let presentHeight = screenHeight - 120;
var styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
    },
    scrollViewStyle: {
        backgroundColor:'white',
        height:screenHeight-51-64,
    },
    presentGradeView: {
        backgroundColor: '#333333',
        width: screenWidth,
        position: "absolute",
        top: screenHeight + 60,
        height: BZMDGradeView.height,
    },
    presentServerPromiseView: {
        backgroundColor: '#333333',
        width: screenWidth,
        position: "absolute",
        top: screenHeight + 60,
        height: BZMDServerPromiseView.height,
    }
});

// AppRegistry.registerComponent('BZMDMain', () => BZMDMain);
module.exports = BZMDMain;
