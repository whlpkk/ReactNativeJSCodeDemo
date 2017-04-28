/*
 * @providesModule BZMUDealBottomView
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var BZMUDealThemeItem = require('BZMUDealThemeItem');

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var PropTypes = React.PropTypes;

var BZMUDealBottomView = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(BZMUDealThemeItem).isRequired,
    onSelected: PropTypes.func,
  },

  render: function() {

    var cells = [];
    var item = this.props.item;
    for (var i in item.vos) {
      var cell =
        <TouchableHighlight style={styles.touch}
          key={i}
          onPress={this._onPress.bind(this,i)} >
        <View style={styles.cell}>
          <TBImage style={styles.image} urlPath={item.vos[i].bottomImage} />
          <Text style={styles.text}>{item.vos[i].text}</Text>
        </View>
      </TouchableHighlight>
      cells.push(cell);
    }

    return (
      <View style={[styles.container,this.props.style]}>
        <View style={styles.line} />
        <View style={styles.bar}>
          {cells}
        </View>
      </View>
    );
  },

  _onPress: function(i) {
    this.props.onSelected && this.props.onSelected(this.props.item.vos[i]);
  },
});

var styles = StyleSheet.create({
  container: {
    height: 50,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5E5',
  },
  line: {
    height: 1,
    backgroundColor: '#d0d0d0',
  },
  bar: {
    height: 49,
    flexDirection: 'row',
    backgroundColor: 'white',
    width: screenWidth,
  },
  touch: {
    height: 49,
    flex: 1,
  },
  cell: {
    height: 49,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  image: {
    width: 21,
    height: 21,
    backgroundColor: 'transparent',
  },

  text: {
    marginTop: 5,
    fontSize: 10,
    color: '#545c66'
  },
});

module.exports = BZMUDealBottomView;
