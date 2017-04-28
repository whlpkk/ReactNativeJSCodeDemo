/*
 * @providesModule BZMDScrollToLookMore
 * @flow
 */
'use strict';
var React = require('react-native');

var {
    NavigatorIOS,
    AppRegistry,
    StyleSheet,
    View,
    ListView,
    ScrollView,
    Text,
    TouchableHighlight
} = React;

var BZMDImageText = require('BZMDImageText');
var BZMDDimension= require('BZMDDimension');
var BZMDRecommend = require('BZMDRecommend');

var TBImage = require('../../bzm_core/components/TBImage');
var BZMCoreUtils = require('../../bzm_core/utils/BZMCoreUtils');
var BZMUDealVo = require('BZMUDealVo');
var BZMUDealGridItem = require('BZMUDealGridItem');
var BZMDMobileLog = require('BZMDMobileLog');

var Dimensions = require('Dimensions');
var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

var API_URL = 'http://th5.m.zhe800.com/theme/banner?';
// var API_URL = 'http://localhost:8081/demo/recommend.json?platform=ios&dev=true';

var SHOP_NOTICE_API = 'http://th5.m.zhe800.com/h5new/cach/prodprops?';

var enableRender = false;
var PropTypes = React.PropTypes;
var BZMDScrollToLookMore = React.createClass({
  propTypes: {
    onScrollToOrigin: PropTypes.func,
    onScrollToTop: PropTypes.func,
    datas:PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
       selectTag: 0,
       currentSelectTag:0,
       items: [],
       shopNoticeStr:''
    };
  },

  fetch: function(){
    if (!enableRender) {
      this.fetchData();
      this.fetchShopNoticeData();
    }
  },
  fetchShopNoticeData: function(){
    var url = SHOP_NOTICE_API + 'zid=' +this.props.datas.prod.productId +
              '&sellerId=' + this.props.datas.prod.product.sellerId +
              '&id=' + this.props.datas.deal.id + '&flag=1';

    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .catch((error) => {
        enableRender = true;
        this.setState(this.state);
      })
      .then((responseData) => {
        if (responseData==null) {
          enableRender = true;
          this.setState(this.state);
          return;
        }

        var shopNoticeData = BZMCoreUtils.jsonParse(responseData["/h5/api/getshopposter"]);
        if (shopNoticeData !=null && shopNoticeData != undefined) {
          if (shopNoticeData.result.code == 0) {
            this.setState({
                shopNoticeStr:shopNoticeData.shopTemplate.shopNotice.notice
              }
            );
          }else {
            console.log('店铺公告获取失败'+shopNoticeData.result.failDescList);
          }
        }

      })
      .done();
  },
    fetchData: function() {
      var url = API_URL + 'zid=' +this.props.datas.prod.productId +
                '&sellerid=' + this.props.datas.prod.product.sellerId;

      console.log(url);
      fetch(url)
        .then((response) => response.json())
        .catch((error) => {
          enableRender = true;
          this.setState(this.state);
        })
        .then((responseData) => {
          if (responseData==null) {
            enableRender = true;
            this.setState(this.state);
            return;
          }
          var objects = [];
          for (var i = 0; i < responseData.length; i++) {
            var dict = responseData[i];
            objects.push(dict.deals[0]);
          }

          var dealVos = objects.map((dealVo) => {
            return new BZMUDealVo(dealVo);
          });

          var items = [];
          var item;
          for (var index in dealVos) {
            var dealVo = dealVos[index];
            if (index % 2 == 0) {
              item = new BZMUDealGridItem();
              items.push(item);
            }
            item.vos.push(dealVo);
          }
          this.state.items.push(...items);
          enableRender = true;
          this.setState({items:this.state.items});

        })
        .done();
    },

  pressText:function(tag){
    if (this.state.currentSelectTag != tag && enableRender) {
      this.refs.BZMDScrollToLookMoreScrollView.getScrollResponder().scrollTo({x:screenWidth*tag,y:0,animated:true});
      this.setState({
          selectTag: tag,
          currentSelectTag: tag
      });

      //页面流转打点
      if (this.props.datas && this.props.datas.deal.id) {
          var dealId = this.props.datas.deal.id;
          var analysisId = "";
          switch (tag+1) {
              case 1:
                  //图文详情
                  analysisId = "pic";
                  break;
              case 2:
                  //尺码参数
                  analysisId = "sku";
                  break;
              case 3:
                  //相关推荐
                  analysisId = "correlation";
                  break;
              default:
          }
          var modelVo = {
              "analysisId": analysisId,
              "analysisType": 'tab',
              "analysisIndex": tag+1,
          };
          BZMDMobileLog.pushLogForPageName(dealId,modelVo);
      }
    }
  },
    render: function(){
      var mainView =null;
      var imageTextRecommendItems = [];
      var itemsArray = this.state.items;
      if (this.props.datas.dealrecord.isYph == 2) {
        //2是优品汇
          for (var i = 0; i < itemsArray.length; i++) {
            if (imageTextRecommendItems.length < 4) {
                imageTextRecommendItems.push(itemsArray[i]);
            }
          }
      }else {
        if (this.state.items.length >= 6) {
          for (var i = 0; i < itemsArray.length; i++) {
            if (imageTextRecommendItems.length < 4) {
                imageTextRecommendItems.push(itemsArray[i]);
            }
          }
        }else {
          imageTextRecommendItems = [];
        }
      }
      if (enableRender) {
          mainView =  <ScrollView ref="BZMDScrollToLookMoreScrollView"
                          style={styles.scroll}
                          horizontal={true}
                          pagingEnabled ={true}
                          onMomentumScrollEnd={this._onContentSizeChange}
                          showsHorizontalScrollIndicator={false}
                          >
                            <View style={styles.contentView}>
                              <BZMDImageText
                              onScrollToOrigin={this.scrollToOrigin}
                              datas={this.props.datas}
                              items={imageTextRecommendItems}
                              recommendDealData = {this.props.recommendDealData}
                              shopNoticeStr={this.state.shopNoticeStr}/>
                            </View>
                            <View style={styles.contentView}>
                              <BZMDDimension onScrollToOrigin={this.scrollToOrigin}
                                              datas={this.props.datas}/>
                            </View>
                            <View style={styles.contentView}>
                              <BZMDRecommend onScrollToOrigin={this.scrollToOrigin}
                                             datas={this.props.datas}
                                              items={this.state.items}/>
                            </View>
                          </ScrollView>;
      }


        return(
          <View style={styles.container}>

            <View style={[styles.topBar,styles.sbu_borderBottom]}>
              <View style={[styles.barItem,
                            styles.item_borderBottom,
                            {borderColor:this.state.selectTag==0?'#EF4949':'white',
                            borderBottomWidth:2}]}>
                <Text
                style={[styles.textStyle,{color:this.state.selectTag==0?'#EF4949':'#27272F'}]}
                onPress={() => this.pressText(0)}>
                  图文详情
                </Text>
              </View>

              <View style={[styles.barItem,
                            styles.item_borderBottom,
                            {borderColor:this.state.selectTag==1?'#EF4949':'white',
                            borderBottomWidth:2}]}>
                <Text
                style={[styles.textStyle,{color:this.state.selectTag==1?'#EF4949':'#27272F'}]}
                onPress={() => this.pressText(1)}>
                  尺码／参数
                </Text>
              </View>

              <View style={[styles.barItem,
                            styles.item_borderBottom,
                            {borderColor:this.state.selectTag==2?'red':'white',
                            borderBottomWidth:2}]}>
                <Text
                style={[styles.textStyle,{color:this.state.selectTag==2?'red':'#27272F'}]}
                onPress={() => this.pressText(2)}>
                  相关推荐
                </Text>
              </View>

            </View>

            {mainView}

            {this.renderTopButton()}
          </View>
        );
    },
    renderTopButton: function(listIndex) {
      var button = (<TouchableHighlight
        style={styles.topButtonContainer}
        activeOpacity={0.9}
        onPress={this._onTopButtonPress}>
        <View>
          <TBImage
            urlPath={BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_btn_top.png'}
            style={styles.topButton} />
        </View>
      </TouchableHighlight>);

      return button;
    },

    _onTopButtonPress: function(e) {
      this.props.onScrollToTop && this.props.onScrollToTop();
    },
    _onContentSizeChange:function(e){
      switch (e.nativeEvent.contentOffset.x) {
        case 0: this.pressText(0);

          break;
        case screenWidth: this.pressText(1);

          break;
        case screenWidth*2: this.pressText(2);

          break;
        default:

      }
    },
    scrollToOrigin:function(e){
      this.props.onScrollToOrigin && this.props.onScrollToOrigin();
    }
});

var topBarHeight = 44;
var topButtonWidth = 32;

var styles = StyleSheet.create({
  container: {
      marginTop:64,
      height:screenHeight-51-64
  },
  topBar:{
    height:topBarHeight,
    // backgroundColor:'red',
    flexDirection:'row',
    alignItems:'center'
  },
  textStyle:{
    fontSize:15
  },
  barItem:{
    flex:1,
    alignItems:'center',
    backgroundColor:'white',
    height:topBarHeight,
    justifyContent:'center'
  },
  scroll:{
    backgroundColor:'white',
    width:screenWidth,
    height:screenHeight-44-51-64
  },
  contentView:{
    width:screenWidth,
    height:screenHeight-44-51-64
  },

  topButton:{
    width: topButtonWidth,
    height: topButtonWidth,
    backgroundColor: 'transparent',
  },

  topButtonContainer: {
    position: 'absolute',
    bottom:20,
    right:20,
    width: topButtonWidth,
    height: topButtonWidth,
    borderRadius: topButtonWidth/2,
  },

  sbu_borderBottom:{
    borderColor:'#d5d5d5',
    borderBottomWidth:0.5
  },
  item_borderBottom:{
    borderColor:'red',
    borderBottomWidth:2
  }
});


module.exports = BZMDScrollToLookMore;
