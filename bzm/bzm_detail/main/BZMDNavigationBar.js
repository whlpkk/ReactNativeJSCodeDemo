/*
 * @providesModule BZMDNavigationBar
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var BZMUDealHeadItem = require('BZMUDealHeadItem');
var BZMCoreUtils = require('BZMCoreUtils');
var TBFavoriteManager = require('TBFavoriteManager');
var TBTip = require('TBTip');
var TBShareManager = require('TBShareManager');
var BZMDMobileLog = require('BZMDMobileLog');

var {
  Image,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var dealVo = {
  "id": 3205377,
  "title": "【优品汇】中长款韩范宽松蕾丝衬衫",
  "short_title": "中长款韩范宽松蕾丝衬衫",
  "oos": 0,
  "recommend_reason": "面料柔软，中长款版型，稍有线头，蕾丝易勾刮，注意洗护",
  "list_price": 19900,
  "price": 3900,
  "begin_time": "2016-03-02 09:00:00",
  "today": 1,
  "expire_time": "2020-01-01 23:59:00",
  "recommender_id": 1,
  "expire_status": 1,
  "tao_tag_id": 1,
  "wap_url": "http://out.zhe800.com/jump?id=3205377\u0026jump_source=2",
  "share_url": "http://out.zhe800.com/jump?url=http%3A%2F%2Fth5.m.zhe800.com%2Fh5%2Fweixin%2Fshopdeal%3Fid%3D3205377\u0026jump_source=2",
  "deal_url": "http://out.zhe800.com/jump?id=3205377\u0026jump_source=2",
  "baoyou": true,
  "fanjifen": true,
  "huiyuangou": false,
  "zhuanxiang": false,
  "promotion": false,
  "coupon_infos": {
    "lijian_price": 0,
    "coupon_price": 0,
    "coupon_wap_url": ""
  },
  "pic_width": 0,
  "pic_height": 0,
  "shop": {
    "id": 0,
    "credibility": {
      "area_name": "cap",
      "offset": "2"
    },
    "rate": "98.90%",
    "name": "旺旺食品旗舰店",
    "items_count": 256,
    "pic_path": "http://logo.taobao.com/shop-logo",
    "click_url": "http://out.tao800.com/m/shop/1",
    "scores": {
      "item_score": {
        "name": "描述相符",
        "score": "4.8",
        "contrast": "高于19.47%"
      },
      "service_score": {
        "name": "服务态度",
        "score": "4.8",
        "contrast": "持平----"
      },
      "delivery_score": {
        "name": "发货速度",
        "score": "4.8",
        "contrast": "持平----"
      }
    }
  },
  "shop_type": 0,
  "deal_type": 0,
  "image_url": {
    "big": "http://z2.tuanimg.com/imagev2/site/720x480.6860a5d7d22e66c1594355fea1904b60.390x260.jpg",
    "normal": "http://z2.tuanimg.com/imagev2/site/720x480.6860a5d7d22e66c1594355fea1904b60.260x174.jpg",
    "small": "http://z2.tuanimg.com/imagev2/site/720x480.6860a5d7d22e66c1594355fea1904b60.180x120.jpg",
    "hd1": "http://z2.tuanimg.com/imagev2/site/700x700.c5a8c53a5e326f627fe4338e44fd2464.640x700+1-1.224x244.jpg",
    "hd2": "http://z2.tuanimg.com/imagev2/site/700x700.c5a8c53a5e326f627fe4338e44fd2464.640x700+1-1.342x374.jpg",
    "hd3": "http://z2.tuanimg.com/imagev2/site/700x700.c5a8c53a5e326f627fe4338e44fd2464.640x700+1-1.516x564.jpg",
    "hd4": "http://z2.tuanimg.com/imagev2/site/720x480.6860a5d7d22e66c1594355fea1904b60.240x160.jpg",
    "hd5": "http://z2.tuanimg.com/imagev2/site/700x700.c5a8c53a5e326f627fe4338e44fd2464.640x700+1-1.302x330.jpg"
  },
  "square_image": "",
  "image_share": "http://z2.tuanimg.com/imagev2/site/700x700.c5a8c53a5e326f627fe4338e44fd2464.170x170.jpg",
  "detail_url": "http://h5.m.zhe800.com/h5/deals/xinkuanzho_3205377",
  "scores": {
    "z0": 8,
    "z1": 16,
    "z2": 24,
    "z3": 32,
    "z4": 32,
    "z5": 32
  },
  "source_type": 1,
  "zid": "ze160101032034038200",
  "sales_count": 1037,
  "brand_id": -1,
  "brand_product_type": 0,
  "taobao_id": ""
};
var PropTypes = React.PropTypes;

var BZMDNavigationBar = React.createClass({
  propTypes: {
    onBack: PropTypes.func,
    title: PropTypes.string,
    netWorkError: PropTypes.object,
    loading: PropTypes.bool,
    datas:PropTypes.object //首页接口的deal数据
  },
  getInitialState: function() {
    return {
      favorite:null,
    };
  },
  getDefaultProps: function() {
    return {
      datas:{},

    };
  },

  componentDidMount() {
    if (!this.props.loading && !this.props.netWorkError
        && this.props.datas && this.props.datas.deal.id){
      TBFavoriteManager.getFavoriteState(parseInt(this.props.datas.deal.id), function(favorited){
        this.setState({
          favorite: favorited
        });
      }.bind(this));
    }
  },
  onPressFavoriteButton() {
    TBFavoriteManager.onFavoritePress(parseInt(this.props.datas.deal.id), function(favorited){
      this.setState({
        favorite: favorited
      });

      if (favorited) {
        TBTip.show('收藏成功');
        //页面流转打点
        if (this.props.datas && this.props.datas.deal.id) {
            var dealId = this.props.datas.deal.id;
            var modelVo = {
                "analysisId": String(dealId),
                "analysisType": 'favorite',
                "analysisIndex": 1,
            };
            BZMDMobileLog.pushLogForPageName(dealId,modelVo);
        }
      }
    }.bind(this));
  },
  onPressShareButton() {
    TBShareManager.shareWithParameters({
      deal: dealVo,
    });
  },
  render: function() {
    var url = (this.state.favorite ? 'bundle://new_favorite_selected@2x.png':'bundle://new_favorite_unselected@2x.png');
    if (!this.props.loading && !this.props.netWorkError) {
      return (
        <View style={styles.container}>
          <TBImage style={styles.background} urlPath={BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_navbar_bg.png'} />
          <View style={styles.bar}>
            <TouchableHighlight
              style={[styles.backButton]}
              underlayColor={'transparent'}
              onPress={this._onBack}>
              <View style={styles.backButton}>
                <TBImage style={styles.backArrow} urlPath={BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_navbar_goback.png'} />
              </View>
            </TouchableHighlight>

            <View style={styles.titleView}>
            <Text style={styles.titleText}>{this.props.title}</Text>
            </View>

            <TouchableHighlight
              style={[styles.favoriteButton]}
              underlayColor={'transparent'}
              onPress={this.onPressFavoriteButton}
              >
              <View >
                <TBImage style={styles.favoriteImageStyle} urlPath={url} />
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={[styles.shareButton]}
              underlayColor={'transparent'}
              onPress={this.onPressShareButton}
              >
              <View >
                <TBImage style={styles.shareImageStyle} urlPath={'bundle://common_taobaodetail_share@2x.png'} />
              </View>
            </TouchableHighlight>

          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <TBImage style={styles.background} urlPath={BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_navbar_bg.png'} />
        <View style={styles.bar}>
          <TouchableHighlight
            style={[styles.backButton]}
            underlayColor={'transparent'}
            onPress={this._onBack}>
            <View style={styles.backButton}>
              <TBImage style={styles.backArrow} urlPath={BZMCoreUtils.baseICONPath()+'/bzm_udeal/bzm_udeal_navbar_goback.png'} />
            </View>
          </TouchableHighlight>

          <View style={styles.titleView}>
            <Text style={styles.titleText}>{this.props.title}</Text>
          </View>
        </View>
      </View>
    );
  },

  _onBack: function() {
    this.props.onBack && this.props.onBack();
  },

});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    height: 64,
  },
  background: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  bar: {
    position: 'absolute',
    top: 20,
    width: screenWidth,
    height: 44,
    alignItems: 'center',
    flexDirection: 'row',
  },

  favoriteButton: {
    position: 'absolute',
    top:10,
    right:10+24 + 20,
  },

  favoriteImageStyle:{
    width: 24,
    height: 24,
    backgroundColor: 'transparent'
  },
  shareButton: {
    position: 'absolute',
    top:10,
    right:10,
  },

  shareImageStyle:{
    width: 24,
    height: 24,
    backgroundColor: 'transparent'
  },

  backButton: {
    width: 50,
    height: 40,
    justifyContent: 'center',
  },

  backArrow: {
    marginLeft: 13,
    width: 12,
    height: 22,
    backgroundColor: 'transparent',
  },
  titleView:{
    width:100,
    height:44,
    marginLeft:(screenWidth-100)/2 -50,
    justifyContent:'center',
    alignItems:'center',

  },

  titleText: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '400',
    color: '#27272f',
  },
});

module.exports = BZMDNavigationBar;
