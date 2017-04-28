/*
 * @providesModule BZMUDealHeadView
 * @flow
 */
'use strict';

var React = require('react-native');
var TBImage = require('TBImage');
var BZMUDealHeadItem = require('BZMUDealHeadItem');

var {
  Image,
  StyleSheet,
  Text,
  View,
} = React;

var PropTypes = React.PropTypes;

var BZMUDealHeadView = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(BZMUDealHeadItem).isRequired,
  },

  render: function() {
    var cells = [];
    var item = this.props.item;
    for (var i in item.vos) {
      var cell = <View key={i} style={styles.cell}>
        <TBImage urlPath={item.vos[i].imageUrl} style={styles.image}/>
        <Text style={styles.text}>{item.vos[i].text}</Text>
      </View>
      cells.push(cell);
    }
    return (<View style={[styles.container,this.props.style]}>{cells}</View>);
  }
});

var kCommentCellHeight = 40;
var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: kCommentCellHeight,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },

  cell: {
    height: kCommentCellHeight,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  image: {
    width: 23,
    height: 23,
    marginLeft: 15,
    marginRight: 6,
    backgroundColor: 'transparent',
  },

  text: {
    fontSize: 11,
    color: '#545c66'
  },
});

module.exports = BZMUDealHeadView;
module.exports.height = kCommentCellHeight;
