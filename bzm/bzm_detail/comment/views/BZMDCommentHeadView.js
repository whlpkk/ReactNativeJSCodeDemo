/*
 * @providesModule BZMDCommentHeadView
 * @flow
 */
'use strict';

var React = require('react-native');
var BZMDCommentHeadItem = require('BZMDCommentHeadItem');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
} = React;


var PropTypes = React.PropTypes;
var BZMDCommentHeadView = React.createClass({
  statics: {
    Item: BZMDCommentHeadItem,
  },

  propTypes: {
    item: PropTypes.instanceOf(BZMDCommentHeadItem).isRequired,
    onSelectChange: PropTypes.func,
  },

  getInitialState: function() {
    return {
      currentSelectIndex: 0,
    };
  },

  render: function() {
    var item = this.props.item;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>{'共'+item.totalNum+'人参与评分'}</Text>
          <Text style={{textAlign:'right'}}>
            好评率：
            <Text style={{color:'red'}}>{item.goodCommentRate+'%'}</Text>
          </Text>
        </View>
        <View style={styles.bottom}>
          {this.renderButton('全部评价',-1,0)}
          {this.renderButton('有图',item.countWithPic,1)}
          {this.renderButton('追评',item.countWithAppend,2)}
        </View>
        <View style={styles.separator} />
      </View>
    );
  },

  renderButton: function(text,count,index) {

    if (count == 0) {
        return null;
    }else if (count > 1) {
        text = text+'('+count+')';
    }

    var buttonStyle = styles.buttonContainer;
    var textStyle = styles.buttonText;
    if (this.state.currentSelectIndex === index) {
      buttonStyle = [styles.buttonContainer,{backgroundColor:'#DB403D'}];
      textStyle = [styles.buttonText,{color:'white'}];
    }

    return (
      <TouchableHighlight
        onPress={this._onPress.bind(this,index)}
        style={{marginLeft:12,borderRadius:5}}
        underlayColor={'transparent'}
        activeOpacity={1}>
        <View style={buttonStyle}>
          <Text style={textStyle}>{text}</Text>
        </View>
      </TouchableHighlight>
    );
  },

  _onPress: function(index) {
    if (index != this.state.currentSelectIndex) {
      this.setState({currentSelectIndex:index});
      this.props.onSelectChange && this.props.onSelectChange(index);
    }
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    height: 85,
  },

  header: {
    flexDirection: 'row',
    marginHorizontal: 12,
    height: 38,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },

  buttonContainer: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#fce9e7',
  },

  buttonText: {
    fontSize: 11,
    color: '#545c66',
    marginHorizontal: 7,
  },

  separator: {
    height: 1,
    backgroundColor: '#ebebeb',
    marginTop: 10,
    marginLeft: 12,
  },

});

module.exports = BZMDCommentHeadView;
