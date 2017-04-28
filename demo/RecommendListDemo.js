/*
 * @providesModule RecommendListDemo
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var TBFacade = require('TBFacade');

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
var BZMDRecommendList = require('BZMDRecommendList');
var BZMUDealVo = require('BZMUDealVo');
var BZMUDealGridItem = require('BZMUDealGridItem');
var BZMUDealNavigationBar = require('BZMUDealNavigationBar');
var TBWebView = require('TBWebView');



var {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ListView,
} = React;

var API_URL = 'http://m.api.zhe800.com/v5/deals?per_page=20&image_type=si3,si1&image_model=webp&super=2&user_role=1&student=1&user_type=1&page=1'

var PropTypes = React.PropTypes;

var RecommendListDemo = React.createClass({
  getInitialState: function() {
    return {
      items: [],
      webViewLoaded: false,
      contentSizeHeight: 20000,
    };
  },

  containerViewResponderCapture: function(evt) {
    return this.props.tbNativeMoving;
  },

  componentDidMount: function() {
    this.fetchData();
  },

  render: function() {



    return (
      <View style={styles.container}
        ref="containerView"
        onStartShouldSetResponderCapture={(evt)=>this.containerViewResponderCapture(evt)}
        onMoveShouldSetResponderCapture={(evt)=>this.containerViewResponderCapture(evt)} >
        <BZMUDealNavigationBar title={'推荐列表'} onBack={this._goBack} />
        <BZMDRecommendList items={this.state.items} renderHeader={this.renderHeader}/>
      </View>
    );
  },

  renderHeader: function() {
    return (
        <TBWebView
          style = {{height:this.state.contentSizeHeight}}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          source={{uri:'http://th5.m.zhe800.com/h5/api/detailpic?zid=ze151013222502000676&isbuy=true&jk=1170011457527616915TfActXWw'}}
          onContentSizeChange={this._onContentSizeChange} />
    );
  },

  _onContentSizeChange: function(event) {
    var contentSizeHeight = parseInt(event.nativeEvent.height);
    console.log(event.nativeEvent);
    this.setState({webViewLoaded:true,contentSizeHeight:contentSizeHeight});
  },

  fetchData: function() {
    fetch(API_URL)
      .then((response) => response.json())
      .catch((error) => {
      })
      .then((responseData) => {
        if (!responseData) {
          return;
        }

        var dealVos = responseData.objects.map((dealVo) => {
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
        this.setState({items:this.state.items});
      })
      .done();
  },

  _goBack: function() {
    var cView = this.refs["containerView"];
    var cTag = React.findNodeHandle(cView);
    TBFacade.goBack(cTag);
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F6F6F6',
  },

  title: {
    fontSize: 13,
    marginTop: 2,
    marginHorizontal: 5,
    textAlign: 'center',
  },
});

AppRegistry.registerComponent('RecommendListDemo', () => RecommendListDemo);
