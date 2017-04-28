'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    ListView,
    TextInput,
    WebView,
} = React;

var TBFacade = require('../bzm/bzm_core/components/TBFacade');
var TBImage = require('TBImage');
var TBAnimation = require('../bzm/bzm_core/components/TBAnimation');

var BZMDGradeView = require('BZMDGradeView');
var BZMDServerPromiseView = require('BZMDServerPromiseView');
var TBShareManager = require('TBShareManager');
var TBFavoriteManager = require('TBFavoriteManager');
var TBTip = require('TBTip');
var TBIMManager = require('TBIMManager');
var TBWebView = require('TBWebView');
var TBSellingReminderManager = require('TBSellingReminderManager');


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

class DealPresentDemo extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        favorite: false,
        webViewLoaded: false,
        offset: 0,
      };
    }

    presentView1() {
        var pView = this.refs["presentView"];
        var cView = this.refs["containerView"];
        var reactTag = React.findNodeHandle(pView);
        var cTag = React.findNodeHandle(cView);
        TBAnimation.presentView(reactTag, cTag);
    }

    onTest2() {
      var pView = this.refs["presentView2"];
      var cView = this.refs["containerView"];
      var reactTag = React.findNodeHandle(pView);
      var cTag = React.findNodeHandle(cView);
      TBAnimation.presentView(reactTag, cTag);
    }

    onTest3() {
      TBShareManager.shareWithParameters({
        deal: dealVo,
      });
    }

    onTest4() {
      TBFavoriteManager.onFavoritePress(dealVo.id, function(favorited){
        this.setState({
          favorite: favorited
        });

        if (favorited) {
          TBTip.show('收藏成功');
        }
      }.bind(this));
    }

    onTest5() {
      var cView = this.refs["containerView"];
      var cTag = React.findNodeHandle(cView);
      TBFacade.forward(cTag, 'http://localhost:8081/bzm/bzm_detail/comment/BZMDCommentList.bundle?platform=ios&dev=true');
    }

    onTest6() {

      var parameters = {
        "type": "deal",
        "j_info": {
          "busUid": "959871#0",
          "jids": "2_9be863394f153d64844dcb4e7cca95b5@im.zhe800.com,2_8b0cd1b178b24726bff6fbdf4d8d39ea@im.zhe800.com,2_e6b5be6178cf4d68be08a43b791b6eeb@im.zhe800.com,2_0a20f256ae2540218d1d662cc0ef47a4@im.zhe800.com",
          "jid": "2_9be863394f153d64844dcb4e7cca95b5@im.zhe800.com",
          "name": "视可欣奇洛数码配件特卖店"
        },
        "data": {
          "id": "2444505",
          "list_price": "28.00",
          "price": "14.90",
          "wap_url": "http://out.zhe800.com/jump?id=2444505&jump_source=2",
          "image_url": {
            "big": [
              "http://z11.tuanimg.com/imagev2/trade/800x800.d249a3283cc550d2f8fe0996c91d4374.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.f227b1c3eb7e60afa3324f3d6da75c87.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.c97f047522f4750562a996e084c56080.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.ba47ed13fd8daad20e79f5d18a697cc8.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.36ff5573fb284faee409c92dfbaa62ac.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.efbb50acb1c4ecfb4ee26b5c6bbd0615.400x.jpg"
            ],
            "hd1": [
              "http://z11.tuanimg.com/imagev2/trade/800x800.d249a3283cc550d2f8fe0996c91d4374.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.f227b1c3eb7e60afa3324f3d6da75c87.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.c97f047522f4750562a996e084c56080.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.ba47ed13fd8daad20e79f5d18a697cc8.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.36ff5573fb284faee409c92dfbaa62ac.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.efbb50acb1c4ecfb4ee26b5c6bbd0615.400x.jpg"
            ],
            "normal": [
              "http://z11.tuanimg.com/imagev2/trade/800x800.d249a3283cc550d2f8fe0996c91d4374.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.f227b1c3eb7e60afa3324f3d6da75c87.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.c97f047522f4750562a996e084c56080.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.ba47ed13fd8daad20e79f5d18a697cc8.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.36ff5573fb284faee409c92dfbaa62ac.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.efbb50acb1c4ecfb4ee26b5c6bbd0615.400x.jpg"
            ],
            "small": [
              "http://z11.tuanimg.com/imagev2/trade/800x800.d249a3283cc550d2f8fe0996c91d4374.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.f227b1c3eb7e60afa3324f3d6da75c87.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.c97f047522f4750562a996e084c56080.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.ba47ed13fd8daad20e79f5d18a697cc8.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.36ff5573fb284faee409c92dfbaa62ac.400x.jpg",
              "http://z11.tuanimg.com/imagev2/trade/800x800.efbb50acb1c4ecfb4ee26b5c6bbd0615.400x.jpg"
            ]
          },
          "zid": "ze150517211626000323",
          "name": "苹果4/5/6彩色电镀镜子贴膜 iPhone全系列钢化玻璃彩膜 前后膜"
        }
      }

      TBIMManager.openIMWithParameters(parameters);
    }

    onTest7() {
        TBSellingReminderManager.getSellingReminderState(dealVo.id, (contain)=>{
            console.log(contain);
        });
    }

    onTest8() {
        TBSellingReminderManager.settingStartSellingReminder(dealVo.id, "2016-03-30 19:00:00", (result)=>{
            console.log(result);
            console.log(TBSellingReminderManager.Successfully);
            console.log(TBSellingReminderManager.AllReadySet);
            console.log(result === TBSellingReminderManager.NotificationUnavailable);
        })
    }

    componentDidMount() {
      TBFavoriteManager.getFavoriteState(dealVo.id, function(favorited){
        this.setState({
          favorite: favorited
        });
      }.bind(this));
    }
//
    render() {
      var url = (this.state.favorite ? 'bundle://new_favorite_selected@2x.png':'bundle://new_favorite_unselected@2x.png');

      if (this.state.webViewLoaded) {
        console.log(this.state.offset);
        var appView = <View style={{backgroundColor:'red',height:200,width:200,top:this.state.offset}} />;
        var sty = {top:0,left:0,bottom:200,right:0};
      }else {
        var sty = {top:0,left:0,bottom:0,right:0};
      }

            return (
                <View style={styles.container} ref="containerView">
                    <View style={styles.topContainer} ref="navView">
                        <TouchableHighlight style={styles.touchableContainer} onPress={this.presentView1.bind(this)}>
                            <Text style={styles.text}>值不值</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.touchableContainer} onPress={this.onTest2.bind(this)}>
                            <Text style={styles.text}>服务承诺</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.touchableContainer} onPress={this.onTest3.bind(this)}>
                            <Text style={styles.text}>分享</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.touchableContainer} onPress={this.onTest4.bind(this)}>
                          <View>
                            <Text style={styles.text}>收藏</Text>
                            <TBImage style={{width:24,height:24,backgroundColor:'transparent'}} urlPath={url} />
                          </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.touchableContainer} onPress={this.onTest5.bind(this)}>
                            <Text style={styles.text}>跳转评论页</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={styles.topContainer} ref="navView2">
                        <TouchableHighlight style={styles.touchableContainer} onPress={this.onTest6.bind(this)}>
                            <Text style={styles.text}>IM</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.touchableContainer} onPress={this.onTest7.bind(this)}>
                            <Text style={styles.text}>获取提醒状态</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.touchableContainer} onPress={this.onTest8.bind(this)}>
                            <Text style={styles.text}>设置开卖提醒</Text>
                        </TouchableHighlight>
                    </View>

                    <TBWebView
                      style={styles.webView}
                      contentInset={sty}
                      decelerationRate={0.998}
                      source={{uri:'http://th5.m.zhe800.com/h5/api/detailpic?zid=ze151013222502000676&isbuy=true&jk=1170011457527616915TfActXWw'}}
                      injectedJavaScript='document.body.offsetHeight'
                      onLoadEnd={this._onWebLoadEnd.bind(this)} >
                      {appView}
                    </TBWebView>

                    <View style={styles.presentContainer} ref="presentView">
                      <BZMDGradeView
                        type={1}
                        score={0}
                        onCancel={this._onPressClose.bind(this)}
                        onSelect={this._onSelectScore.bind(this)} />
                    </View>

                    <View style={styles.presentContainer2} ref="presentView2">
                      <BZMDServerPromiseView
                        typeArray={[1,2,3,4,5]}
                        time={'24小时'}
                        onClose={this._onPressClose2.bind(this)} />
                    </View>
                </View>);
    }

    _onPressClose() {
        var pView = this.refs["presentView"];
        var reactTag = React.findNodeHandle(pView);
        TBAnimation.dismissView(reactTag);
    }

    _onPressClose2() {
        var pView = this.refs["presentView2"];
        var reactTag = React.findNodeHandle(pView);
        TBAnimation.dismissView(reactTag);
    }

    _onSelectScore(score) {
      console.log(score);
      this._onPressClose();
    }

    _onLoadRequest(event){
      // console.log(event);
      return true;
    }
    _onWebLoadEnd(event) {
      // console.log('-=-=-------=====');
      // console.log(event.nativeEvent.jsEvaluationValue);
      var offset = parseInt(event.nativeEvent.jsEvaluationValue);
      this.setState({webViewLoaded:true,offset:offset});
    }
}

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
let presentHeight = screenHeight - 120;
var styles = StyleSheet.create({
    text: {
        fontSize: 17,
        color: '#ffffff'
    },
    btContainer: {
        justifyContent: 'center',
        backgroundColor: '#007755',
        marginLeft: 10,
        marginTop: 10,
        height: 40
    },


    container: {
        backgroundColor: '#eeeeee',
        flex: 1,
        flexDirection: 'column'
    },

    webView: {
      height: 100,
      borderWidth: 1,
      backgroundColor: 'transparent',
    },

    bottomContainer: {
        backgroundColor: '#5522ee',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    touchableContainer: {
        marginLeft: 10,
        width: 60,
        backgroundColor: '#777b7c'
    },
    topContainer: {
        paddingTop: 20,
        paddingBottom: 0,
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        backgroundColor: '#11ffee',
        height: 64,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    presentContainer: {
        backgroundColor: '#333333',
        width: screenWidth,
        position: "absolute",
        top: screenHeight + 60,
        height: BZMDGradeView.height,
    },
    presentContainer2: {
        backgroundColor: '#333333',
        width: screenWidth,
        position: "absolute",
        top: screenHeight + 60,
        height: BZMDServerPromiseView.height,
    },


    hidden: {
      flex: 0,
      height: 0,
    }
});

React.AppRegistry.registerComponent('DealPresentDemo', ()=> DealPresentDemo);
