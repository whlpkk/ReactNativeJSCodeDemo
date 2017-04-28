/*
 * @providesModule BZMDServerPromiseView
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var BZMCoreUtils = require('BZMCoreUtils');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
} = React;

var serverPromiseViewHeight = 400;

var PropTypes = React.PropTypes;
var BZMDServerPromiseView = React.createClass({

  propTypes: {
    typeArray: PropTypes.arrayOf(PropTypes.number).isRequired,
    time: PropTypes.string,
    onClose: PropTypes.func,
  },

  render: function() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    dataSource = dataSource.cloneWithRows(this.props.typeArray);

    return (
      <View style={styles.container} >
        <Text style={styles.title}>服务说明</Text>
        <ListView
          dataSource={dataSource}
          showsVerticalScrollIndicator={false}
          renderRow={this.renderRow}
        />
        <TouchableHighlight
          onPress={this._onClosePress} >
          <View style={styles.closeButton}>
            <Text style={styles.close} >关  闭</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  },

  renderRow: function(key) {
    var item = this._objectForKey(key);

    if (!item) {
      return <View />;
    }

    return (
      <View>
        <View style={styles.contentView} >
          <TBImage style={styles.icon} urlPath={BZMCoreUtils.baseICONPath()+'/bzm_detail/bzmd_serverpromise.png'} />
          <View style={styles.textView}>
            <Text style={styles.textTitle} >{item.title}</Text>
            <Text style={styles.textSubTitle} >{item.subTitle}</Text>
          </View>
        </View>
        <View style={styles.line} />
      </View>
    );
  },

  _objectForKey: function(key): Object {
    switch (key) {
      case 1:
        var object = {
          title: this.props.time+'发货',
          subTitle: '商家承诺'+this.props.time+'为您发货'
        };
        break;
      case 2:
        var object = {
          title: '人工质检',
          subTitle: '该商品通过验货师严格的样品检测'
        };
        break;
      case 3:
        var object = {
          title: '8天包退',
          subTitle: '签收8天内且商品完好，可享受无理由退货服务'
        };
        break;
      case 4:
        var object = {
          title: '运费补贴',
          subTitle: '8天无理由退货成功享受8元退货运费补贴券'
        };
        break;
      case 5:
        var object = {
          title: '先行赔付',
          subTitle: '在商家同意退款后，折800官方将先行垫付，退款极速到账'
        };
        break;
      default:
        break;
    }
    return object;
  },

  _onClosePress: function() {
    this.props.onClose && this.props.onClose();
  },

});

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: serverPromiseViewHeight,
    width: screenWidth,
  },

  title: {
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    color: '#27272F',
  },

  closeButton: {
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EF4949',
  },

  close: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },

  contentView: {
    marginHorizontal: 10,
    marginVertical: 15,
    flexDirection: 'row',
  },

  icon: {
    width: 15,
    height: 15,
    backgroundColor: 'transparent',
  },

  textView: {
    flex:1,
    marginLeft: 11,
    marginRight: 10,
  },

  textTitle:{
    fontSize: 15,
    color: '#27272F',
  },

  textSubTitle:{
    fontSize: 12,
    lineHeight: 15,
    color: '#9D9D9D',
    marginTop: 10,
    // marginHorizontal:0,
  },

  line: {
    height:  1,
    marginLeft: 10,
    backgroundColor: '#F1F1F1',
  },

});

module.exports = BZMDServerPromiseView;
module.exports.height = serverPromiseViewHeight;
