/*
 * @providesModule BZMDBanner
 * @flow
 */
'use strict';
var React = require('react-native');
var TBImage = require('../../bzm_core/components/TBImage');
var TBFacade = require('TBFacade');
var BZMDBlank = require('BZMDBlank');
var BZMDMobileLog = require('BZMDMobileLog');

var {
    NavigatorIOS,
    AppRegistry,
    StyleSheet,
    View,
    TouchableHighlight,
} = React;

//http://th5.m.zhe800.com/tao800/commonbanner.json?user_type=1&ad_type=1&user_role=1&show_key=H5detailpage
var BANNER_API_URL = 'http://th5.m.zhe800.com/tao800/commonbanner.json?'
// var BANNER_API_URL = 'http://localhost:8081/demo/banner.json?platform=ios&dev=true';

var BZMDBanner = React.createClass({
  getInitialState: function() {
    return {
      datas:null,

    };
  },

  componentDidMount: function() {
    this.fetchBannerData();
  },

  fetchBannerData: function() {

    TBFacade.nativeInfo(function(dm){
      var  deviceId = dm.deviceId;
      var showKey = 'H5detailpage';
      //1不是优品汇 2是
      if (this.props.datas.dealrecord.isYph == 2) {
        showKey = 'H5youpin';
      }else {
        showKey = 'H5detailpage';
      }
      var url = BANNER_API_URL +'user_type=' + dm.usertype
              + '&ad_type=' + '1'
              + '&user_role='+ dm.userrole
              + '&show_key=' + showKey;
      console.log(url);

      fetch(url)
        .then((response) => response.json())
        .catch((error) => {
          console.log('banner获取失败');
        })
        .then((responseData) => {
          if (responseData !=null && responseData.length > 0) {
            this.setState({
              datas:responseData
            });
          }
        })
        .done();
    }.bind(this));
  },
    forward: function(url){
      var cView = this.refs["containerView"];
      var cTag = React.findNodeHandle(cView);
      TBFacade.forward(cTag, url);

      //页面流转打点
      if (this.props.datas && this.props.datas.deal.id) {
          var dealId = this.props.datas.deal.id;
          var modelVo = {
              analysisId: String(this.state.datas[0].id),
              analysisType: 'banner',
              analysisIndex: 1,
          };
          BZMDMobileLog.pushLogForPageName(dealId,modelVo);
      }
    },

    render: function(){
      if (this.state.datas==null || this.state.datas[0].image == undefined
        || this.state.datas[0]==undefined || this.state.datas.length==0) {

        return(
          <View/>
        );
      }else {
        return(
          <View ref="containerView">
          <TouchableHighlight onPress={() =>this.forward(this.state.datas[0].url)}>
          <View style={styles.container}>

          <View style={styles.bannerView}>
              <TBImage style={styles.image}
                       urlPath={this.state.datas[0].image}/>
          </View>
          </View>
          </TouchableHighlight>
          </View>

        );
      }
    }
});

var Dimensions = require('Dimensions');
var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
  container: {
      height:116,
      width:screenWidth,
      backgroundColor:'#f6f6f6'
  },
  bannerView:{
    marginTop:10,
    marginRight:10,
    marginLeft:10,
    marginBottom:10,
    flex:1
  },
  image:{
    flex:1,
    backgroundColor:'transparent'
  }
});


module.exports = BZMDBanner;
