/*
 * @providesModule BZMDGradeView
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var BZMCoreUtils = require('BZMCoreUtils');

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var gradeViewHeight = 295;

var PropTypes = React.PropTypes;
var BZMDGradeView = React.createClass({

  propTypes: {
    //1.划算度  2.评级
    type: PropTypes.number.isRequired,

    //0：代表没有选择  1~5代表很值~很不值
    score: PropTypes.number.isRequired,

    //回调函数，返回选择的score
    onSelect: PropTypes.func,

    //回调函数
    onCancel: PropTypes.func,
  },

  render: function() {
    var title = (this.props.type===1 ? '您认为此商品的划算程度如何？':'为了评级的客观性，我们需要您的参与！');
    return (
      <View>
        <TBImage style={styles.container} urlPath={BZMCoreUtils.baseICONPath()+'/bzm_detail/bzmd_grade_bg.png'} />
        <View style={styles.container}>
          <Text style={styles.title} numberOfLines={1} >{title}</Text>
          <View style={styles.buttonContainer} >
            {this.renderButton('很值','#fc8a78',5)}
            {this.renderButton('值','#fda839',4)}
            {this.renderButton('一般','#cad64a',3)}
            {this.renderButton('不值','#4ad6c7',2)}
            {this.renderButton('很不值','#4abad6',1)}
          </View>
          <Text style={styles.tip} numberOfLines={1} >注：此商品经过折800严格的砍价和质检</Text>
          <TouchableHighlight
            style={styles.cancelButton}
            onPress={this._onCancelPress}
            underlayColor={'transparent'}
            activeOpacity={1}>
            <Text style={styles.cancel} >取消</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },

  renderButton:function(title,backgroundColor,score) {
    if (this.props.score === 0) {
      return (
        <TouchableHighlight
          style={styles.button}
          onPress={this._onPress.bind(this,score)}>
          <View style={[styles.button,{backgroundColor:backgroundColor}]} >
            <Text style={{color:'white'}} >{title}</Text>
          </View>
        </TouchableHighlight>
      );
    }else {
      var bgColor = (this.props.score === score) ? backgroundColor:'#d5d5d5';
      return (
        <View style={[styles.button,{backgroundColor:bgColor}]} >
          <Text style={{color:'white'}} >{title}</Text>
        </View>
      );
    }
  },

  _onPress: function(score) {
    this.props.onSelect && this.props.onSelect(score);
  },

  _onCancelPress: function() {
    this.props.onCancel && this.props.onCancel();
  },

});

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    height: gradeViewHeight,
    width: screenWidth,
  },

  title: {
    marginTop: 35,
    textAlign: 'center',
    // fontSize: 15,
    color: '#545c66',
  },

  buttonContainer:{
    marginTop:41,
    marginBottom: 57,
    marginHorizontal:5,
    height: 58,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },

  button: {
    width: 58,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 29,
  },

  tip: {
    textAlign: 'center',
    color: '#545c66',
    fontSize: 12,
  },

  line: {
    marginTop: 26,
    backgroundColor: '#f0f0f0',
    height: 1,
  },

  cancelButton: {
    flex:1,
    marginTop:27,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancel: {
    fontSize: 17,
    color: '#666666',
    textAlign: 'center',
  },
});

module.exports = BZMDGradeView;
module.exports.height = gradeViewHeight;
