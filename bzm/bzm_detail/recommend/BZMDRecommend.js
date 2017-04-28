/*
 * @providesModule BZMDRecommend
 * @flow
 */
'use strict';
var React = require('react-native');
var BZMDRecommendList = require('BZMDRecommendList');
var BZMUDealVo = require('BZMUDealVo');
var BZMUDealGridItem = require('BZMUDealGridItem');
var TBImage = require('TBImage');
var TBFacade = require('TBFacade');

var {
    NavigatorIOS,
    AppRegistry,
    StyleSheet,
    View,
    ScrollView
} = React;

var Dimensions = require('Dimensions');
var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;


var PropTypes = React.PropTypes;
var BZMDRecommend = React.createClass({
  propTypes: {
    onScrollToOrigin: PropTypes.func,
    items:PropTypes.array.isRequired,
    datas:PropTypes.object,
  },
  _ScrollViewEndDrag: function(e){
    var offset = e.nativeEvent.contentOffset.y;
    if (offset < -60) {
      this.props.onScrollToOrigin && this.props.onScrollToOrigin();
    }
  },
    render: function(){
        var dealId = this.props.datas.deal.id;
        return(
          <View style={styles.container}>
            <BZMDRecommendList
              onScrollEndDrag={this._ScrollViewEndDrag}
              pageId={"detai_"+String(dealId)+"_correlation"}
              pageName="detai"
              analysisType="correlation"
              items={this.props.items} />
          </View>
        );
    }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height:screenHeight - 51 - 44 -64,
    backgroundColor: '#F6F6F6',
  },
});

module.exports = BZMDRecommend;
