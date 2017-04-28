/*
 * @providesModule BZMUDealBannerView
 * @flow
 */
'use strict';
var React = require('react-native');
var TBImage = require('TBImage');
var TBFacade = require('TBFacade');

var {
    NavigatorIOS,
    AppRegistry,
    StyleSheet,
    View,
    TouchableHighlight,
} = React;

var BANNER_API_URL = 'http://m.api.zhe800.com/youpin/banner'

var PropTypes = React.PropTypes;
var BZMUDealBannerView = React.createClass({
    propTypes: {
      datas: PropTypes.object,
      onResponseData: PropTypes.func,
      onPress: PropTypes.func,
    },

  getInitialState: function() {
    return {
      datas:null,
    };
  },

  componentDidMount: function() {
    if (!this.props.datas) {
      this.fetchBannerData();
    }else {
      this.setState({
        datas: this.props.datas,
      });
    }
  },

  fetchBannerData: function() {
    var url = BANNER_API_URL;
    fetch(url)
      .then((response) => response.json())
      .catch((error) => {
          this.setState({
            datas:null,
          });
          this.props.onResponseData && this.props.onResponseData(null);
      })
      .then((responseData) => {
        if (responseData && responseData.hasOwnProperty("url") && responseData.url.length>0) {
          this.setState({
            datas:responseData,
          });
          this.props.onResponseData && this.props.onResponseData(responseData);
          return;
        }
        this.setState({
          datas:null,
        });
        this.props.onResponseData && this.props.onResponseData(null);
      })
      .done();
  },

  render: function(){

    if (this.state.datas && this.state.datas.hasOwnProperty("url") && this.state.datas.url.length>0) {
        var data = this.state.datas;
        return(
          <View ref="containerView" style={styles.container}>
            <TouchableHighlight style={styles.flex_1} onPress={() =>this.props.onPress(data.url)}>
              <View style={styles.flex_1}>
                <TBImage style={styles.image} urlPath={data.pic||""}/>
              </View>
            </TouchableHighlight>
          </View>
        );
    }
    return null;
  }
});

var Dimensions = require('Dimensions');
var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
  container: {
      height:screenWidth/640*244,
      width:screenWidth,
      backgroundColor:'#f6f6f6'
  },
  flex_1: {
    flex: 1,
  },
  image:{
    flex:1,
    backgroundColor: 'transparent',
  }
});


module.exports = BZMUDealBannerView;
